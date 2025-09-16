const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  // Reference to existing store (optional)
  storeName: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Store",
    required: false
  },
  
  // Embedded store info (optional)
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

  // Other fields
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
  category: { type: String },
  location: {
    district: String,
    city: String,
    pincode: String
  },
  plan: { type: String, enum: ["platinum", "diamond", "gold"] },
  shareLink: { type: String },
  watermarkImage: { type: String }

}, { timestamps: true });

// Add the pre-save hook HERE - after schema definition, before model creation
couponSchema.pre('save', function(next) {
  // If using store reference, clear embedded data
  if (this.storeName) {
    this.storeInfo = undefined;
  }
  // If using embedded data, clear reference
  if (this.storeInfo && this.storeInfo.storeName) {
    this.storeName = undefined;
  }
  next();
});

// Also add pre-update hook for findOneAndUpdate operations
couponSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  
  if (update.storeName) {
    update.storeInfo = undefined;
  }
  if (update.storeInfo && update.storeInfo.storeName) {
    update.storeName = undefined;
  }
  
  next();
});

module.exports = mongoose.model("Coupon", couponSchema);