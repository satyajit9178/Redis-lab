require("dotenv").config();

const Redis = require("ioredis");

const REDIS_URL =
    process.env.REDIS_URL || "redis://localhost:6380";

function createRedisClient(clientName) {

    const redis = new Redis(REDIS_URL);

    redis.on("connect", () => {
        console.log(`${clientName}: Connected to Redis`);
    });

    redis.on("error", (err) => {
        console.error(`${clientName}:`, err.message);
    });

    return redis;
}

module.exports = createRedisClient;