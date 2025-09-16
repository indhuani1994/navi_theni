const Store = require("../model/Store");


function safeJSONParse(value, fallback = {}) {
  if (!value) return fallback;
  try {
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch (err) {
    return fallback;
  }
}

// Create Store
exports.createStore = async (req, res) => {
  try {
    const body = req.body;

    console.log("➡️ Incoming Body:", body);
    console.log("➡️ Incoming Files:", req.files);

    // Group files by fieldname for easier access
    const files = {};
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (!files[file.fieldname]) {
          files[file.fieldname] = [];
        }
        files[file.fieldname].push(file);
      });
    }

    // ✅ Safe parse
    let services = safeJSONParse(body.services, []);
    let products = safeJSONParse(body.products, []);
    let location = safeJSONParse(body.location, {});
    let socialMediaLinks = safeJSONParse(body.socialMediaLinks, {});

    // ✅ Attach service images
    if (services.length > 0) {
      services = services.map((srv, i) => {
        const serviceImageKey = `serviceImages[${i}]`;
        if (files[serviceImageKey] && files[serviceImageKey].length > 0) {
          return {
            ...srv,
            image: files[serviceImageKey][0].path
          };
        } else if (files.serviceImages && i < files.serviceImages.length) {
          return {
            ...srv,
            image: files.serviceImages[i].path
          };
        }
        return srv;
      });
    }

    // ✅ Attach product images
    if (products.length > 0) {
      products = products.map((prd, i) => {
        const productImageKey = `productImages[${i}]`;
        if (files[productImageKey] && files[productImageKey].length > 0) {
          return {
            ...prd,
            image: files[productImageKey][0].path
          };
        } else if (files.productImages && i < files.productImages.length) {
          return {
            ...prd,
            image: files.productImages[i].path
          };
        }
        return prd;
      });
    }

    // ✅ Create new store
    const newStore = new Store({
      storeName: body.storeName,
      category: body.category,
      description: body.description,
      plan: body.plan,
      review: body.review,
      location,
      aboutMe: body.aboutMe,
      phoneNumber: body.phoneNumber,
      websiteLink: body.websiteLink,
      socialMediaLinks,
      coverImage: files.coverImage && files.coverImage.length > 0
        ? files.coverImage[0].path
        : null,
      logoImage: files.logoImage && files.logoImage.length > 0
        ? files.logoImage[0].path
        : null,
      galleryImages: files.galleryImages
        ? files.galleryImages.map((f) => f.path)
        : [],
      services,
      products,
    });

    // ✅ Save to DB
    const savedStore = await newStore.save();
    res.status(201).json(savedStore);

  } catch (err) {
    console.error("❌ Error creating store:", err);
    res.status(500).json({
      error: "Failed to create store",
      details: err.message,
    });
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

// GET: Single Store
exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: Update Store
// PUT: Update Store
// PUT: Update Store
// PUT: Update Store - Fixed version
exports.updateStore = async (req, res) => {
  try {
    let updates = { ...req.body };
    const storeId = req.params.id;

    // ✅ First, get the current store to preserve existing images
    const currentStore = await Store.findById(storeId);
    if (!currentStore) {
      return res.status(404).json({ message: "Store not found" });
    }

    // ✅ Parse JSON fields
    if (updates.services) updates.services = safeJSONParse(updates.services, []);
    if (updates.products) updates.products = safeJSONParse(updates.products, []);
    if (updates.location) updates.location = safeJSONParse(updates.location, {});
    if (updates.socialMediaLinks) {
      updates.socialMediaLinks = safeJSONParse(updates.socialMediaLinks, {});
    }

    // Group files by fieldname for easier access
    const files = {};
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (!files[file.fieldname]) {
          files[file.fieldname] = [];
        }
        files[file.fieldname].push(file);
      });
    }

    // ✅ Handle cover image
    if (files.coverImage && files.coverImage.length > 0) {
      updates.coverImage = files.coverImage[0].path;
    } else {
      updates.coverImage = currentStore.coverImage;
    }

    // ✅ Handle logo image
    if (files.logoImage && files.logoImage.length > 0) {
      updates.logoImage = files.logoImage[0].path;
    } else {
      updates.logoImage = currentStore.logoImage;
    }

    // ✅ Handle gallery images - append new ones to existing
    if (files.galleryImages && files.galleryImages.length > 0) {
      updates.galleryImages = [
        ...(currentStore.galleryImages || []),
        ...files.galleryImages.map((f) => f.path)
      ];
    } else {
      updates.galleryImages = currentStore.galleryImages;
    }

    // ✅ FIX: Handle service images correctly
    if (updates.services) {
      updates.services = updates.services.map((service, index) => {
        // Check if there's a file with this specific index
        const serviceImageKey = `serviceImages[${index}]`;
        
        // If this service has a new image file
        if (files[serviceImageKey] && files[serviceImageKey].length > 0) {
          return {
            ...service,
            image: files[serviceImageKey][0].path
          };
        }
        
        // If this is an existing service, preserve its image
        const existingService = currentStore.services.find(
          s => s._id && service._id && s._id.toString() === service._id.toString()
        );
        
        if (existingService) {
          return {
            ...service,
            image: service.image || existingService.image
          };
        }
        
        // For new services without images, keep whatever was sent
        return service;
      });
    }

    // ✅ FIX: Handle product images correctly
    if (updates.products) {
      updates.products = updates.products.map((product, index) => {
        // Check if there's a file with this specific index
        const productImageKey = `productImages[${index}]`;
        
        // If this product has a new image file
        if (files[productImageKey] && files[productImageKey].length > 0) {
          return {
            ...product,
            image: files[productImageKey][0].path
          };
        }
        
        // If this is an existing product, preserve its image
        const existingProduct = currentStore.products.find(
          p => p._id && product._id && p._id.toString() === product._id.toString()
        );
        
        if (existingProduct) {
          return {
            ...product,
            image: product.image || existingProduct.image
          };
        }
        
        // For new products without images, keep whatever was sent
        return product;
      });
    }

    // ✅ Update the store
    const updatedStore = await Store.findByIdAndUpdate(storeId, updates, {
      new: true,
      runValidators: true
    });

    res.json({ message: "✅ Store updated successfully", store: updatedStore });
  } catch (err) {
    console.error("❌ Error updating store:", err);
    res.status(500).json({ error: err.message });
  }
};


// DELETE: Store
exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });
    res.json({ message: "Store deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// DELETE: Remove a specific service from a store
// DELETE: Remove a specific service from a store
exports.deleteService = async (req, res) => {
  try {
    const { storeId, serviceIndex } = req.params;
    
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    
    // Remove the service at the specified index
    if (store.services && store.services.length > serviceIndex) {
      store.services.splice(serviceIndex, 1);
      await store.save();
      return res.json({ message: "Service deleted successfully", store });
    }
    
    res.status(404).json({ message: "Service not found" });
  } catch (err) {
    console.error("❌ Error deleting service:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE: Remove a specific product from a store
exports.deleteProduct = async (req, res) => {
  try {
    const { storeId, productIndex } = req.params;
    
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }
    
    // Remove the product at the specified index
    if (store.products && store.products.length > productIndex) {
      store.products.splice(productIndex, 1);
      await store.save();
      return res.json({ message: "Product deleted successfully", store });
    }
    
    res.status(404).json({ message: "Product not found" });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ error: err.message });
  }
};
