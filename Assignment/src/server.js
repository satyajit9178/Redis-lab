require("dotenv").config();

const app = require("./app");
const redis = require("./config/redis");

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Verify Redis connection before accepting requests
        await redis.ping();

        console.log("Redis connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Unable to start server:", error.message);
        process.exit(1);
    }
}

startServer();