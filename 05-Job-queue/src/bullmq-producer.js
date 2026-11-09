const emailQueue = require("./bullmq-queue");

async function addJobs() {

    // Job 1: Send email
    const emailJob = await emailQueue.add(
        "send-email",
        {
            to: "satyajit@example.com",
            subject: "Welcome to our application",
            simulateFailureOnce: true
        }
    );

    console.log("Email job added:", emailJob.id);


    // Job 2: Generate invoice
    const invoiceJob = await emailQueue.add(
        "generate-invoice",
        {
            orderId: "ORD101"
        }
    );

    console.log("Invoice job added:", invoiceJob.id);
}


async function main() {

    try {
        await addJobs();

    } catch (error) {
        console.error("Producer error:", error);

        process.exitCode = 1;

    } finally {
        await emailQueue.close();
        console.log("Producer connection closed");
    }
}

main();