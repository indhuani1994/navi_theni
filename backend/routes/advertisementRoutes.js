const express = require("express");
const {
 createAdvertisement,getAdvertisementById,getAdvertisements,updateAdvertisement,deleteAdvertisement
} = require("../controller/advertisementController");
const upload = require("../middleware/upload");


const router = express.Router();

const uploadAds = upload.fields([
  { name: "hero[image]", maxCount: 10 },
  { name: "strap[image]", maxCount: 10 },
  { name: "coupon[image]", maxCount: 10 },
  { name: "slider[logoImage]", maxCount: 10 },
  { name: "logo[image]", maxCount: 10 },  // Added logo image upload support
]);


router.post("/",uploadAds, createAdvertisement);        // Create Ad
router.get("/", getAdvertisements);           // Get All Ads
router.get("/:id", getAdvertisementById);     // Get Single Ad
router.put("/:id",uploadAds, updateAdvertisement);      // Update Ad
router.delete("/:id", deleteAdvertisement);   // Delete Ad

module.exports = router;
