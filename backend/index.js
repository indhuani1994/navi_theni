const express = require("express");
const connectdb = require("./database/db");
const cors = require("cors");
const dotenv = require("dotenv");
const userroutes = require("./routes/User");
const createDefaultAdmin = require("./utils/createDefaultAdmin");
const storeroutes = require("./routes/storeRoutes");
const couponRoutes = require("./routes/couponRoutes");
const jobRoutes = require("./routes/jobRoutes");
const advertisementRoutes = require("./routes/advertisementRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const path = require("path");

dotenv.config();

const app = express();

// CORS setup
// Allow local dev and deployed frontend URL
const allowedOrigins = [
  "http://localhost:5173", // your local frontend
  "https://your-frontend-deploy-url.com" // replace with your deployed frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin like Postman
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const port = process.env.PORT || 4000;

app.use("/api/users", userroutes);
app.use("/api/stores", storeroutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/ads", advertisementRoutes);
app.use("/api/enquiries", enquiryRoutes);

app.listen(port, async () => {
  console.log(`✅ Server is running on ${port}`);
  await connectdb();
  await createDefaultAdmin();
});
