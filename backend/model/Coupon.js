const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
storeName: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
storeInfo: {
  storeName: String,
  category: String,
  location: {
    district: String,
    city: String,
    pincode: String,
  },
  plan: String,
},

 // linked to Store
  image: { type: String },
  
  offerTitle: {
    highlight: { type: String, required: true },
    normal: { type: String }
  },
  
  description: { type: String },
  termsAndCondition: { type: String },
  expiredDate: { type: Date, required: true },
  addsPoster: { type: String },
  couponCode: { type: String, required: true, unique: true },
  
  category: { type: String },   // auto from Store
  location: {
    district: String,
    city: String,
    pincode: String
  },
  plan: { type: String, enum: ["platinum", "diamond", "gold"] },  // auto from Store
  
  shareLink: { type: String },
  watermarkImage: { type: String }

}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema);
