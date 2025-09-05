const Advertisement = require("../model/Advertisement");

// Helper: get uploaded file path
const getFilePath = (files, field) => {
  return files && files[field] && files[field][0] ? files[field][0].path : undefined;
};

// POST: Create Advertisement
exports.createAdvertisement = async (req, res) => {
  try {
    const { category } = req.body;
    const files = req.files;

    let hero = req.body.hero ? JSON.parse(req.body.hero) : {};
    let strap = req.body.strap ? JSON.parse(req.body.strap) : {};
    let coupon = req.body.coupon ? JSON.parse(req.body.coupon) : {};
    let slider = req.body.slider ? JSON.parse(req.body.slider) : {};

    // Attach uploaded images
    if (category === "hero" && files) {
      hero.image = getFilePath(files, "hero[image]");
    }
    if (category === "strap" && files) {
      strap.image = getFilePath(files, "strap[image]");
    }
    if (category === "coupon" && files) {
      coupon.image = getFilePath(files, "coupon[image]");
    }
    if (category === "slider" && files) {
      slider.logoImage = getFilePath(files, "slider[logoImage]");
    }

    const ad = await Advertisement.create({
      category,
      hero,
      strap,
      coupon,
      slider,
    });

    res.status(201).json({ message: "Advertisement created successfully", ad });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: All Ads
exports.getAdvertisements = async (req, res) => {
  try {
    const ads = await Advertisement.find();
    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: Single Ad by ID
exports.getAdvertisementById = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Advertisement not found" });
    res.json(ad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: Update Ad
exports.updateAdvertisement = async (req, res) => {
  try {
    const { category } = req.body;
    const files = req.files;

    let hero = req.body.hero ? JSON.parse(req.body.hero) : {};
    let strap = req.body.strap ? JSON.parse(req.body.strap) : {};
    let coupon = req.body.coupon ? JSON.parse(req.body.coupon) : {};
    let slider = req.body.slider ? JSON.parse(req.body.slider) : {};

    // Replace images if new files uploaded
    if (category === "hero" && files) hero.image = getFilePath(files, "hero[image]") || hero.image;
    if (category === "strap" && files) strap.image = getFilePath(files, "strap[image]") || strap.image;
    if (category === "coupon" && files) coupon.image = getFilePath(files, "coupon[image]") || coupon.image;
    if (category === "slider" && files) slider.logoImage = getFilePath(files, "slider[logoImage]") || slider.logoImage;

    const ad = await Advertisement.findByIdAndUpdate(
      req.params.id,
      { category, hero, strap, coupon, slider },
      { new: true }
    );

    if (!ad) return res.status(404).json({ message: "Advertisement not found" });

    res.json({ message: "Advertisement updated successfully", ad });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: Remove Ad
exports.deleteAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.findByIdAndDelete(req.params.id);
    if (!ad) return res.status(404).json({ message: "Advertisement not found" });
    res.json({ message: "Advertisement deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
