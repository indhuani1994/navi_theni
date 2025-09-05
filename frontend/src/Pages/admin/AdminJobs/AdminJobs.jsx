import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminJobs.css";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [editingJob, setEditingJob] = useState(null);
  const [editData, setEditData] = useState({});

  // Fetch jobs from backend
  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/jobs");
      setJobs(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Delete job
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`http://localhost:4000/api/jobs/${id}`);
        setJobs(jobs.filter((job) => job._id !== id));
      } catch (err) {
        console.error("Error deleting job:", err);
      }
    }
  };

  // Open edit modal
  const handleEditClick = (job) => {
    setEditingJob(job._id);
    setEditData({
      jobName: job.jobName,
      title: job.title,
      salary: job.salary || "",
      qualification: job.qualification || "",
      mode: job.mode || "onsite",
      skills: job.skills?.join(", ") || "",
      location: {
        district: job.location?.district || "",
        city: job.location?.city || "",
        pincode: job.location?.pincode || "",
      },
      storeName: job.storeName?._id || "",
    });
  };

  // Close edit modal
  const closeModal = () => {
    setEditingJob(null);
    setEditData({});
  };

  // Handle edit form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["district", "city", "pincode"].includes(name)) {
      setEditData({ ...editData, location: { ...editData.location, [name]: value } });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  // Submit edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/jobs/${editingJob}`, {
        ...editData,
        skills: editData.skills.split(",").map((s) => s.trim()),
      });
      fetchJobs();
      closeModal();
    } catch (err) {
      console.error("Error updating job:", err);
    }
  };

  if (loading) return <p>Loading jobs...</p>;

  return (
    <div className="admin-jobs-container">
      <h2>Jobs List</h2>
      <table className="admin-jobs-table">
        <thead>
          <tr>
            <th>Job Name</th>
            <th>Title</th>
            <th>Store</th>
            <th>Category</th>
            <th>Plan</th>
            <th>Location</th>
            <th>Salary</th>
            <th>Qualification</th>
            <th>Mode</th>
            <th>Skills</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td>{job.jobName}</td>
              <td>{job.title}</td>
              <td>{job.storeName?.storeName || "N/A"}</td>
              <td>{job.storeName?.category || "N/A"}</td>
              <td>{job.storeName?.plan || "N/A"}</td>
              <td>
                {job.location?.district}, {job.location?.city}, {job.location?.pincode}
              </td>
              <td>{job.salary}</td>
              <td>{job.qualification}</td>
              <td>{job.mode}</td>
              <td>{job.skills?.join(", ")}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditClick(job)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(job._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editingJob && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Job</h2>
            <form onSubmit={handleEditSubmit}>
              <label>Job Name:</label>
              <input type="text" name="jobName" value={editData.jobName} onChange={handleChange} required />

              <label>Title:</label>
              <input type="text" name="title" value={editData.title} onChange={handleChange} required />

              <label>Salary:</label>
              <input type="text" name="salary" value={editData.salary} onChange={handleChange} />

              <label>Qualification:</label>
              <input type="text" name="qualification" value={editData.qualification} onChange={handleChange} />

              <label>Mode:</label>
              <select name="mode" value={editData.mode} onChange={handleChange}>
                <option value="onsite">Onsite</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>

              <label>Skills (comma separated):</label>
              <input type="text" name="skills" value={editData.skills} onChange={handleChange} />

              <label>Location:</label>
              <input type="text" name="district" placeholder="District" value={editData.location.district} onChange={handleChange} />
              <input type="text" name="city" placeholder="City" value={editData.location.city} onChange={handleChange} />
              <input type="text" name="pincode" placeholder="Pincode" value={editData.location.pincode} onChange={handleChange} />

              <label>Store ID:</label>
              <input type="text" name="storeName" value={editData.storeName} onChange={handleChange} />

              <div className="form-buttons">
                <button type="submit" className="edit-btn">Update Job</button>
                <button type="button" className="delete-btn" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
