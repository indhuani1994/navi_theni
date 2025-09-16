const express = require("express");
const upload = require("../middleware/upload");
const {
  createCoupon,
  getCouponById,
  getCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../controller/couponController");

const router = express.Router();

// POST - Create Coupon with image & addsPoster
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "addsPoster", maxCount: 1 },
    { name: "watermarkImage", maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      if (req.files.image) req.body.image = "/uploads/stores/" + req.files.image[0].filename;
      if (req.files.addsPoster) req.body.addsPoster = "/uploads/stores/" + req.files.addsPoster[0].filename;
      if (req.files.watermarkImage) req.body.watermarkImage = "/uploads/stores/" + req.files.watermarkImage[0].filename;

      await createCoupon(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// PUT - Update Coupon with image & addsPoster
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "addsPoster", maxCount: 1 },
     { name: "watermarkImage", maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      // Attach uploaded file paths to req.body
      if (req.files.image) req.body.image = "/uploads/stores/" + req.files.image[0].filename;
      if (req.files.addsPoster) req.body.addsPoster = "/uploads/stores/" + req.files.addsPoster[0].filename;
      if (req.files.watermarkImage) req.body.watermarkImage = "/uploads/stores/" + req.files.watermarkImage[0].filename;

      await updateCoupon(req, res);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/", getCoupons);
router.get("/:id", getCouponById);
router.delete("/:id", deleteCoupon);

module.exports = router;
