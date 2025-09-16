const mongoose = require("mongoose");

const advertisementSchema = new mongoose.Schema({
 category: {
    type: String,
    enum: ["hero", "strap", "coupon", "slider", "logo"],  // Added "logo"
    required: true
  },

  // HERO specific fields
  hero: {
    image: { type: String },
    title: { type: String },
    description: { type: String },
    buttonName: { type: String },
    buttonUrl: { type: String },
    btnBackgroundColor: { type: String }
  },

  // STRAP specific fields
  strap: {
    image: { type: String }
  },
 logo: {
    image: { type: String }
  },
  // COUPON specific fields
  coupon: {
    couponName:{type:String},
    image: { type: String }
  },

  // SLIDER specific fields
  slider: {
    title: { type: String },
    logoImage: { type: String },
    content: { type: String },
    buttonName: { type: String },
    buttonColor: { type: String },
    buttonUrl: { type: String },
    buttonBackgroundColor: { type: String }
  }

}, { timestamps: true });

module.exports = mongoose.model("Advertisement", advertisementSchema);
