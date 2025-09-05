const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  jobName: { type: String, required: true },
  title: { type: String, required: true },
  salary: { type: String },
  qualification: { type: String },
  description: { type: String },
  mode: { type: String, enum: ["onsite", "remote", "hybrid"], default: "onsite" },
  skills: [{ type: String }], // array of skills
  applicationLink: { type: String },

  storeName: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },

  location: {
    district: String,
    city: String,
    pincode: String,
  },
  logo: { type: String },
  phoneNumber: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
