const mongoose = require("mongoose");
const Job = require("../model/Job");
const Store = require("../model/Store");

// POST: Create Job
exports.createJob = async (req, res) => {
  try {
    const {
      jobName, title, salary, qualification, description, mode, skills,
      applicationLink, storeName, location, logo, phoneNumber
    } = req.body;

    let store;

    if (mongoose.Types.ObjectId.isValid(storeName)) {
      // Case 1: existing store
      store = await Store.findById(storeName);
      if (!store) return res.status(400).json({ message: "Store not found" });
    } else {
      // Case 2: create new store
      if (!location || !logo || !phoneNumber) {
        return res.status(400).json({
          message: "New store requires location, logo, and phoneNumber"
        });
      }

      store = await Store.create({
        storeName,
        location,
        logoImage: logo,
        phonenumber: phoneNumber,
        category: "General", // default if not given
        plan: "gold"         // default if not given
      });
    }

    // Create Job
    const job = await Job.create({
      jobName,
      title,
      salary,
      qualification,
      description,
      mode,
      skills,
      applicationLink,
      storeName: store._id,
      location: store.location,
      logo: store.logoImage,
      phoneNumber: store.phonenumber
    });

    res.status(201).json({ message: "Job created successfully", job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: All Jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("storeName", "storeName category plan");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET: Single Job
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("storeName", "storeName category plan");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT: Update Job
exports.updateJob = async (req, res) => {
  try {
    const { storeName } = req.body;
    let updateData = { ...req.body };

    if (storeName) {
      if (mongoose.Types.ObjectId.isValid(storeName)) {
        // existing store
        const store = await Store.findById(storeName);
        if (!store) return res.status(400).json({ message: "Store not found" });
        updateData.location = store.location;
        updateData.logo = store.logoImage;
        updateData.phoneNumber = store.phonenumber;
      } else {
        // new store
        const { location, logo, phoneNumber } = req.body;
        if (!location || !logo || !phoneNumber) {
          return res.status(400).json({
            message: "New store requires location, logo, and phoneNumber"
          });
        }

        const newStore = await Store.create({
          storeName,
          location,
          logoImage: logo,
          phonenumber: phoneNumber,
          category: "General",
          plan: "gold"
        });

        updateData.storeName = newStore._id;
        updateData.location = newStore.location;
        updateData.logo = newStore.logoImage;
        updateData.phoneNumber = newStore.phonenumber;
      }
    }

    const job = await Job.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job updated successfully", job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE: Remove Job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
