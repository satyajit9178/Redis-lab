require("dotenv").config();
const Redis = require("ioredis");

const redis =  new Redis(process.env.REDIS_URL ||"redis://localhost:6379")

redis.on("connect",()=>{
  console.log("Redis connection established");
})

redis.on("ready",()=>{
  console.log("Redis is ready to accept commands");
})

redis.on("error",()=>{
  console.error("Redis error:", error.message);
})

module.exports = redis;