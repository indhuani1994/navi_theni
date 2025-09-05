const express = require("express");
const {
  createJob,getJobById,getJobs,updateJob,deleteJob
} = require("../controller/jobController");

const router = express.Router();

router.post("/", createJob);     // Create Job
router.get("/", getJobs);        // Get All Jobs
router.get("/:id", getJobById);  // Get Single Job
router.put("/:id", updateJob);   // Update Job
router.delete("/:id", deleteJob); // Delete Job

module.exports = router;
