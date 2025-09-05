const express = require("express");
const {
  createStore,
  getStores,
  getStoreById,
  updateStore,
  deleteStore,
} = require("../controller/storeController");

const upload = require("../middleware/upload"); // ✅ just import upload

const router = express.Router();

// POST - Create Store
router.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "logoImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
    { name: "serviceImages", maxCount: 10 },  // ✅ rename
    { name: "productImages", maxCount: 10 },  // ✅ rename
  ]),
  createStore
);

// PUT - Update Store
router.put(
  "/:id",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "logoImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
    { name: "serviceImages", maxCount: 10 },  // ✅ rename
    { name: "productImages", maxCount: 10 },  // ✅ rename
  ]),
  updateStore
);

router.get("/", getStores);
router.get("/:id", getStoreById);
router.delete("/:id", deleteStore);

module.exports = router;
