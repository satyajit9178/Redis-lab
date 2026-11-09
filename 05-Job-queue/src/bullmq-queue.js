const { Queue } = require("bullmq");

const connection = require("./bullmq-connection");

const emailQueue = new Queue("email-queue", {
    connection: {
        host: connection.host,
        port: connection.port
    },

    defaultJobOptions: {
        attempts: 3,

        backoff: {
            type: "exponential",
            delay: 1000
        },

        removeOnComplete: {
            age: 3600,
            count: 1000
        },

        removeOnFail: {
            age: 24 * 3600,
            count: 5000
        }
    }
});

module.exports = emailQueue;