const express = require("express")
const app=express()
const cors=require("cors")
const rateLimit = require("express-rate-limit")
const ConnectDb = require("./config/DBConnection")
const authRoutes = require("./routes/auth.route")
const farmerRoutes = require("./routes/farmer.routes")
const retailerRoutes = require("./routes/retailer.route")
const transporterRoutes = require("./routes/transproter.route")
const errorHandler = require("./middleware/error.middleware")
require("dotenv").config(); 


const PORT =  process.env.PORT || 5000

app.use(express.json({limit:"10kb"}))
app.use(express.urlencoded({limit:"10kb",extended:true}))

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))
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


app.use("/api/auth", authRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/retailer", retailerRoutes);
app.use("/api/transporter", transporterRoutes);



app.use(errorHandler);

ConnectDb()

app.listen(PORT,()=>
{
    console.log(`Server is running at http://localhost:${PORT}`)
})
