const express = require("express")
const app=express()
const cors=require("cors")
const rateLimit = require("express-rate-limit")
const dotenv=require("dotenv")
const ConnectDb = require("./config/DBConnection")
dotenv.config()

const PORT =  process.env.PORT

app.use(express.json({limit:"10kb"}))
app.use(express.urlencoded({limit:"10kb",extended:true}))
app.use(cors())
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,   
  max: 100,              
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      error: "Too many requests. Slow down."
    });
  }
});

app.use(globalLimiter);
app.use((req, res, next) => {
  res.setTimeout(5000, () => {
    res.status(408).json({ error: "Request timeout" });
  });
  next();
});




app.get("/",(req,res)=>
{
    res.send("hiii")
    console.log("getting requests")
})

ConnectDb()

app.listen(PORT,()=>
{
    console.log(`Server is running at http://localhost:${PORT}`)
})
