const express = require("express")
const connectdb = require("./database/db")
const cors = require('cors')
const dotenv = require("dotenv")
const userroutes = require("./routes/User")
const createDefaultAdmin = require("./utils/createDefaultAdmin")
const storeroutes= require('./routes/storeRoutes')
const couponRoutes = require("./routes/couponRoutes");
const jobRoutes = require("./routes/jobRoutes");
const advertisementRoutes = require("./routes/advertisementRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const path = require("path");



const app = express()
dotenv.config()
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const port = process.env.port

app.use("/api/users", userroutes);
app.use("/api/stores",storeroutes)
app.use("/api/coupons", couponRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/ads", advertisementRoutes);
app.use("/api/enquiries", enquiryRoutes);

app.listen(port, async()=>{
    console.log(`server is running on ${port}`);
    await connectdb()
    await createDefaultAdmin()
    
})