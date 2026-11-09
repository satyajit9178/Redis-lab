
const { Worker } = require("bullmq");

const connection = require("./bullmq-connection");

const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));


async function processJob(job) {

    console.log("\n---------------------------");
    console.log("Job ID:", job.id);
    console.log("Job Name:", job.name);
    console.log("Attempt:", job.attemptsMade + 1);

    switch (job.name) {

        case "send-email": {

            console.log("Sending email to:", job.data.to);

            // Simulate a temporary failure on first attempt
            if (
                job.data.simulateFailureOnce 
            ) {
                console.log("Simulating email provider failure");

                throw new Error("Email provider unavailable");
            }

            await sleep(2000);

            console.log("Email sent successfully");

            return {
                sent: true,
                recipient: job.data.to
            };
        }

        case "generate-invoice": {

            console.log(
                "Generating invoice for:",
                job.data.orderId
            );

            await sleep(3000);

            console.log("Invoice generated successfully");

            return {
                generated: true,
                orderId: job.data.orderId
            };
        }

        default:
            throw new Error(`Unknown job type: ${job.name}`);
    }
}


// Create Worker
const worker = new Worker(
    "email-queue",
    processJob,
    {
        connection,
        concurrency: 3
    }
);


// Events
worker.on("completed", (job, result) => {
    console.log(
        `Job ${job.id} completed successfully`,
        result
    );
});


worker.on("failed", (job, error) => {
    console.error(
        `Job ${job?.id} failed:`,
        error.message,
        `Attempts: ${job?.attemptsMade}`
    );
});


worker.on("error", (error) => {
    console.error("Worker error:", error);
});


console.log("BullMQ worker started...");


// Graceful shutdown
async function shutdown(signal) {
    console.log(`Received ${signal}. Closing worker...`);

    await worker.close();

    console.log("Worker closed gracefully");
}

process.once("SIGINT", () => {
    shutdown("SIGINT").catch(console.error);
});

process.once("SIGTERM", () => {
    shutdown("SIGTERM").catch(console.error);
});
