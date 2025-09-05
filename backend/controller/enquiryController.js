const Enquiry = require("../model/Enquiry");

// POST: Create Enquiry
exports.createEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);
    res.status(201).json({ message: "Enquiry submitted successfully", enquiry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: All Enquiries
exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().populate("storeName", "storeName category");
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: Single Enquiry by ID
exports.getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id).populate("storeName", "storeName category");
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: Update Enquiry (e.g., change status)
exports.updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json({ message: "Enquiry updated successfully", enquiry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: Remove Enquiry
exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json({ message: "Enquiry deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
