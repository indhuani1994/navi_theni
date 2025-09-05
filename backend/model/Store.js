const mongoose = require("mongoose");

// Social Media Schema
const socialMediaSchema = new mongoose.Schema({
  instagram: { type: String },
  facebook: { type: String },
  twitter: { type: String },
  youtube: { type: String },
  email: { type: String },
}, { _id: false });

// Service Schema
const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  description: { type: String },
}, { _id: false });

// Product Schema
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String },
  description: { type: String },
}, { _id: false });

// Store Schema
const storeSchema = new mongoose.Schema({
  storeName: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  description: { type: String },
  coverImage: { type: String },
  logoImage: { type: String },
  plan: { type: String, enum: ["platinum", "diamond", "gold"], default: "gold" },
  review: { type: String },

  location: {
    district: { type: String },
    city: { type: String },
    pincode: { type: String },
    maplink:{ type:String }
  },

  galleryImages: [{ type: String }], // array of images
  aboutMe: { type: String },
  phoneNumber: { type: String },
  websiteLink: { type: String },

  socialMediaLinks: socialMediaSchema,

  services: [serviceSchema], // multiple services
  products: [productSchema], // multiple products

}, { timestamps: true });

module.exports = mongoose.model("Store", storeSchema);
