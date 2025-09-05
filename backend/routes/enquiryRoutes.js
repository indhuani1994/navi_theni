const express = require("express");
const {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry
} = require("../controller/enquiryController");

const router = express.Router();

router.post("/", createEnquiry);        // Submit enquiry
router.get("/", getEnquiries);          // Get all enquiries
router.get("/:id", getEnquiryById);     // Get single enquiry
router.put("/:id", updateEnquiry);      // Update enquiry
router.delete("/:id", deleteEnquiry);   // Delete enquiry

module.exports = router;
