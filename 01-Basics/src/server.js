require("dotenv").config();
const express = require("express");
const Redis  = require("ioredis");
const mongoose = require("mongoose");


const app = express();
const PORT = 3000;

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.get('/redis',async(req,res)=>{
  const reply = await redis.ping();
  res.json({redis:reply});
})


app.get('/mongo',async(req,res)=>{
  const url = process.env.MONGO_URL;
  
  await mongoose.connect(url);

  res.json({mongo:"connected",databse:mongoose.connection.name});
})

app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });