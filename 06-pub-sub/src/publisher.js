
const createRedisClient = require("./redis");

const { randomUUID } = require("crypto");

const publisher = createRedisClient("Order Service");

const CHANNEL = "orders:created";

async function publishOrder() {

    const event = {
        eventId: randomUUID(),

        eventType: "order.created",

        occurredAt: new Date().toISOString(),

        data: {
            orderId: "ORD101",
            userId: 101,
            total: 1499
        }
    };

    // Convert JavaScript object into JSON string
    const message = JSON.stringify(event);

    // Publish message to Redis
    const subscriberCount = await publisher.publish(
        CHANNEL,
        message
    );

    console.log("\n========== ORDER SERVICE ==========");

    console.log("Published event:", event.eventType);

    console.log("Event ID:", event.eventId);

    console.log("Subscribers reached:", subscriberCount);

    console.log("===================================\n");

    if (subscriberCount === 0) {
        console.log("Warning: No active subscribers received this event");
    }
}

async function main() {

    try {

        await publishOrder();

    } catch (error) {

        console.error("Publishing failed:", error);

        process.exitCode = 1;

    } finally {

        await publisher.quit();

        console.log("Publisher connection closed");
    }
}

main();
