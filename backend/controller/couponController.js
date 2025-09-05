const Coupon = require("../model/Coupon");
const Store = require("../model/Store");
const mongoose = require("mongoose");


// POST: Create Coupon
// POST: Create Coupon
exports.createCoupon = async (req, res) => {
  try {
    const {
      storeName,
      image,
      addsPoster,
      offerTitle,
      description,
      termsAndCondition,
      expiredDate,
      couponCode,
      shareLink,
      watermarkImage,
      category,
      location,
      plan,
    } = req.body;

    let couponData;

    if (mongoose.Types.ObjectId.isValid(storeName)) {
      // Existing store
      const store = await Store.findById(storeName);
      if (!store) return res.status(400).json({ message: "Store not found" });

      couponData = {
        storeName: store._id, // ObjectId reference
        category: store.category,
        location: store.location,
        plan: store.plan,
      };
    } else {
      // New store (do NOT save in Store collection)
      if (!category || !location || !plan) {
        return res.status(400).json({ message: "New store requires category, location, and plan" });
      }

      couponData = {
        storeInfo: { storeName, category, location, plan }, // store info inside coupon
      };
    }

    // Create coupon
    const coupon = await Coupon.create({
      ...couponData,
      image,
      addsPoster,
      offerTitle,
      description,
      termsAndCondition,
      expiredDate,
      couponCode,
      shareLink,
      watermarkImage,
    });

    res.status(201).json({ message: "Coupon created successfully", coupon });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// GET: All Coupons
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().populate("storeName", "storeName category plan location");
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: Single Coupon by ID
exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id).populate("storeName", "storeName category plan location");
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: Update Coupon
// PUT: Update Coupon
exports.updateCoupon = async (req, res) => {
  try {
    const { storeName, offerTitle, location, couponCode } = req.body;

    if (!couponCode) return res.status(400).json({ message: "Coupon code is required" });

    // Parse nested JSON if needed
    const parsedOfferTitle = typeof offerTitle === "string" ? JSON.parse(offerTitle) : offerTitle;
    const parsedLocation = typeof location === "string" ? JSON.parse(location) : location;

    // Prepare update data
    const updateData = { ...req.body, offerTitle: parsedOfferTitle, location: parsedLocation };

    // Attach files if uploaded
    if (req.files) {
      if (req.files.image) updateData.image = "/uploads/stores/" + req.files.image[0].filename;
      if (req.files.addsPoster) updateData.addsPoster = "/uploads/stores/" + req.files.addsPoster[0].filename;
    }

    // Update store-related info if storeName is changed
    if (storeName) {
      const store = await Store.findById(storeName);
      if (!store) return res.status(400).json({ message: "Store not found" });
      updateData.category = store.category;
      updateData.location = store.location;
      updateData.plan = store.plan;
    }

    const coupon = await Coupon.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    res.json({ message: "Coupon updated successfully", coupon });
  } catch (err) {
    console.error("Error updating coupon:", err);
    res.status(500).json({ error: err.message });
  }
};




// DELETE: Remove Coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
