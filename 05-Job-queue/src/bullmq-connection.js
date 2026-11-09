require("dotenv").config();

const redisUrl = new URL(
    process.env.REDIS_URL || "redis://127.0.0.1:6379"
);

const connection = {
    host: redisUrl.hostname,
    port: Number(redisUrl.port || 6379),
    maxRetriesPerRequest: null
};


module.exports = connection;