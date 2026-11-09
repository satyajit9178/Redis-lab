require("dotenv").config();
const cors = require("cors");
const express = require("express")
const Redis = require("ioredis")

const app = express();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");


const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());
const BANNER_KEY = "app:banner";

app.post("/banner",async(req,res)=>{
  await redis.set(BANNER_KEY,req.body.message || "Welcome to life of satyajit");
  res.json({success:true});
  console.log("Called again")
})

app.get('/banner',async(req,res)=>{
  const message = await redis.get(BANNER_KEY);
  res.json({message});
})

app.delete('/banner',async(req,res)=>{
  await redis.del(BANNER_KEY);
  res.json({success:true});
})

app.get('/banner/exists',async(req,res)=>{
  const exists = await redis.exists(BANNER_KEY);
  console.log(exists); // it return a NUMBER , exist->1, not exist->0
  res.json({success:Boolean(exists)});
})


app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

app.listen(PORT ,()=>console.log(`Server running on ${PORT}`));
