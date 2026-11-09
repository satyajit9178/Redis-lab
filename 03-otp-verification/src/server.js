require("dotenv").config();

const express = require("express");
const Redis = require("ioredis");
const cors = require("cors");

const {
  randomInt,
  createHmac,
  createHash
} = require("crypto");

const app = express();

const redis = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

const PORT = process.env.PORT || 3001;

const OTP_TTL = 300;       // 5 minutes
const RESEND_COOLDOWN = 60; // 60 seconds

if (!process.env.OTP_SECRET) {
  throw new Error("OTP_SECRET is missing from .env");
}

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

// Generate a consistent identifier without putting email
// addresses directly into Redis key names.
function getUserId(email) {
  return createHash("sha256")
    .update(email)
    .digest("hex");
}

// Generate an HMAC hash of the OTP.
function hashOTP(email, otp) {
  return createHmac("sha256", process.env.OTP_SECRET)
    .update(`${email}:${otp}`)
    .digest("hex");
}

// POST /otp/send
app.post("/otp/send", async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required"
      });
    }

    const userId = getUserId(email);

    const otpKey = `otp:code:${userId}`;
    const attemptsKey = `otp:attempts:${userId}`;
    const cooldownKey = `otp:cooldown:${userId}`;

    // Acquire a resend cooldown.
    const cooldown = await redis.set(
      cooldownKey,
      "1",
      "EX",
      RESEND_COOLDOWN,
      "NX"
    );

    if (!cooldown) {
      const remaining = await redis.ttl(cooldownKey);

      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another OTP",
        retryAfter: Math.max(remaining, 0)
      });
    }

    try {
      // Generate a secure 6-digit OTP.
      const otp = String(randomInt(100000, 1000000));

      // Hash the OTP before storing it.
      const otpHash = hashOTP(email, otp);

      // Store OTP with 5-minute TTL.
      await redis.set(otpKey, otpHash, "EX", OTP_TTL);

      // Reset attempts for the newly generated OTP.
      await redis.del(attemptsKey);

      // Development only: simulate email delivery.
      if (process.env.NODE_ENV !== "production") {
        console.log(`[DEV OTP] ${email}: ${otp}`);
      }

      return res.json({
        success: true,
        message: "OTP generated successfully",
        expiresIn: OTP_TTL,
        resendAfter: RESEND_COOLDOWN
      });

    } catch (error) {
      // Release cooldown if OTP generation/storage fails.
      await redis.del(cooldownKey);
      throw error;
    }

  } catch (error) {
    console.error("OTP generation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate OTP"
    });
  }
});

app.get("/", (req, res) => {
  res.send("OTP server is running");
});

async function startServer() {
  try {
    await redis.ping();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Could not connect to Redis:", error);
    process.exit(1);
  }
}

startServer();
