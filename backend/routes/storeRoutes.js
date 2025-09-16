const express = require("express");
const {
  createStore,
  getStores,
  getStoreById,
  updateStore,
  deleteStore,
  deleteService,
  deleteProduct,
} = require("../controller/storeController");

const upload = require("../middleware/upload"); // ✅ just import upload

const router = express.Router();

// POST - Create Store
router.post(
  "/",
  upload.any(), // Use any() to accept all fields
  createStore
);

// PUT - Update Store
router.put(
  "/:id",
  upload.any(), // Use any() to accept all fields
  updateStore
);

router.get("/", getStores);
router.get("/:id", getStoreById);
router.delete("/:id", deleteStore);
// Add these routes to your existing storeRoutes.js

// DELETE: Remove a specific service
router.delete("/:storeId/services/:serviceIndex", deleteService);

// DELETE: Remove a specific product
router.delete("/:storeId/products/:productIndex", deleteProduct);

module.exports = router;
