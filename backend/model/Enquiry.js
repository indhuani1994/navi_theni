const mongoose = require("mongoose");

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },            // User name
  email: { type: String, required: true },           // User email
  phone: { type: String },                           // Optional phone
  subject: { type: String, required: true },         // Enquiry subject
  message: { type: String, required: true },         // Enquiry message

  storeName: { type: mongoose.Schema.Types.ObjectId, ref: "Store" }, // optional link to store
  status: { type: String, enum: ["pending", "resolved"], default: "pending" } // enquiry status

}, { timestamps: true });

module.exports = mongoose.model("Enquiry", enquirySchema);
