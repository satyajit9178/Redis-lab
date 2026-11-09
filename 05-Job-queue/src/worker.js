const redis = require("./redis");

const sleep = (ms)=>{
  new Promise(resolve => setTimeout(resolve,ms));
}

async function processJob(job) {
  console.log(`Processing job:${job.id}`);
  console.log(`Job type:${job.type}`);

  switch(job.type){
    case "send-email":

            console.log("Sending email to:", job.payload.to); 

            await sleep(2000);

            console.log("Email sent successfully");
            break;

        case "generate-invoice":

            console.log("Generating invoice for:", job.payload.orderId);

            await sleep(3000);

            console.log("Invoice generated successfully");
            break;

        case "send-notification":

            console.log("Sending notification to:", job.payload.userId);

            await sleep(1000);

            console.log("Notification sent successfully");
            break;

        default:
            throw new Error("Unknown job type");
    }
}

async function startWorker(){
  console.log("Worker started. Waiting for jobs...");

   while (true) {

        // Wait until a job becomes available.
        const result = await redis.brpop("jobs", 0);

        const [queueName, rawJob] = result;

        const job = JSON.parse(rawJob);

        console.log("\nReceived from:", queueName);

        try {

            await processJob(job);

            console.log("Job completed:", job.id);

        } catch (error) {

            console.error("Job failed:", error.message);

        }
    }
}

startWorker().catch(console.error);