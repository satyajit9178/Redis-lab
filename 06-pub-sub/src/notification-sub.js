
const createRedisClient = require("./redis");

const subscriber = createRedisClient("Notification Service");

const CHANNEL = "orders:created";

// Listen for incoming messages
subscriber.on("message", (channel, rawMessage) => {

    try {

        const event = JSON.parse(rawMessage);

        console.log("\n========== NOTIFICATION SERVICE ==========");

        console.log("Channel:", channel);
        console.log("Event:", event.eventType);

        console.log("Order ID:", event.data.orderId);
        console.log("User ID:", event.data.userId);

        console.log("Sending order confirmation...");
        console.log("Notification processed successfully");

        console.log("==========================================\n");

    } catch (error) {

        console.error("Invalid message:", error.message);

    }
});

async function startSubscriber() {

    await subscriber.subscribe(CHANNEL);

    console.log(`Notification Service subscribed to ${CHANNEL}`);
}

startSubscriber().catch(console.error);


// Graceful shutdown
async function shutdown() {

    console.log("\nClosing Notification Service...");

    await subscriber.unsubscribe(CHANNEL);
    await subscriber.quit();

    console.log("Notification Service stopped");
}

process.once("SIGINT", () => {
    shutdown().catch(console.error);
});

process.once("SIGTERM", () => {
    shutdown().catch(console.error);
});
