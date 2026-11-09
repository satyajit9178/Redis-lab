
const createRedisClient = require("./redis");

const subscriber = createRedisClient("Analytics Service");

const CHANNEL = "orders:created";

subscriber.on("message", (channel, rawMessage) => {

    try {

        const event = JSON.parse(rawMessage);

        console.log("\n============ ANALYTICS SERVICE ============");

        console.log("Channel:", channel);
        console.log("Event:", event.eventType);

        console.log("Processing analytics for:", event.data.orderId);

        // Simulate updating analytics
        console.log("Total orders incremented");
        console.log("Revenue updated:", event.data.total);

        console.log("===========================================\n");

    } catch (error) {

        console.error("Analytics error:", error.message);

    }
});

async function startSubscriber() {

    await subscriber.subscribe(CHANNEL);

    console.log(`Analytics Service subscribed to ${CHANNEL}`);
}

startSubscriber().catch(console.error);


async function shutdown() {

    console.log("\nClosing Analytics Service...");

    await subscriber.unsubscribe(CHANNEL);
    await subscriber.quit();

    console.log("Analytics Service stopped");
}

process.once("SIGINT", () => {
    shutdown().catch(console.error);
});

process.once("SIGTERM", () => {
    shutdown().catch(console.error);
});
