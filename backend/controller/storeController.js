const Store = require("../model/Store");
const path=require('path')

// POST: Create Store (with multer support)
const getFilePath = (file) => file ? `/uploads/stores/${file.filename}` : null;

// Create Store
exports.createStore = async (req, res) => {
  try {
    const body = req.body;

    // parse arrays from string → JSON
    let services = [];
    let products = [];

    if (body.services) services = JSON.parse(body.services);
    if (body.products) products = JSON.parse(body.products);

    // attach images
    if (req.files["serviceImages"]) {
      services = services.map((srv, i) => ({
        ...srv,
        image: req.files["serviceImages"][i]?.path,
      }));
    }

    if (req.files["productImages"]) {
      products = products.map((prd, i) => ({
        ...prd,
        image: req.files["productImages"][i]?.path,
      }));
    }

    const newStore = new Store({
      storeName: body.storeName,
      category: body.category,
      description: body.description,
      plan: body.plan,
      review: body.review,
      location: body.location,
      aboutMe: body.aboutMe,
      phoneNumber: body.phoneNumber,
      websiteLink: body.websiteLink,
      socialMediaLinks: body.socialMediaLinks,
      coverImage: req.files["coverImage"] ? req.files["coverImage"][0].path : null,
      logoImage: req.files["logoImage"] ? req.files["logoImage"][0].path : null,
      galleryImages: req.files["galleryImages"] ? req.files["galleryImages"].map(f => f.path) : [],
      services,
      products,
    });

    const savedStore = await newStore.save();
    res.status(201).json(savedStore);
  } catch (err) {
    console.error("Error creating store:", err);
    res.status(500).json({ error: "Failed to create store", details: err.message });
  }
};

// GET: All Stores
exports.getStores = async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: Single Store by ID
exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: Update Store (with multer support)
exports.updateStore = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.location) updates.location = JSON.parse(updates.location);
    if (updates.socialMediaLinks) updates.socialMediaLinks = JSON.parse(updates.socialMediaLinks);
    if (updates.services) updates.services = JSON.parse(updates.services);
    if (updates.products) updates.products = JSON.parse(updates.products);

    if (req.files?.coverImage) {
      updates.coverImage = "/uploads/stores/" + req.files.coverImage[0].filename;
    }
    if (req.files?.logoImage) {
      updates.logoImage = "/uploads/stores/" + req.files.logoImage[0].filename;
    }
    if (req.files?.galleryImages) {
      updates.galleryImages = req.files.galleryImages.map((file) => "/uploads/stores/" + file.filename);
    }

    const store = await Store.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!store) return res.status(404).json({ message: "Store not found" });

    res.json({ message: "Store updated successfully", store });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: Remove Store
exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });
    res.json({ message: "Store deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
