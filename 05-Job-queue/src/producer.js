const redis  = require("./redis")
const {randomUUID} = require("crypto");

async function addJob(type,payload){
  const job = {
    id:randomUUID(),
    type,
    payload,
    createdAt:new Date().toISOString(),  
  };

  await redis.lpush(
    "jobs",
    JSON.stringify(job),
  );

  console.log('job added:',job);
}

async function main(){
  try{

    await addJob("send-email",{
      to:"satyajit@example.com",
      subject:"Welocme to my course of redis!",
      body:"Welcome to our application",
    });

    await addJob("generate-invoice", { 
            orderId: "ORD101"
        });

         await addJob("send-notification", {
            userId: 101,
            message: "Your order has been confirmed."
        });
  }
  catch(err){
    console.log("Producer error:",err);
  }finally{
    await redis.quit();
  }
}

main();