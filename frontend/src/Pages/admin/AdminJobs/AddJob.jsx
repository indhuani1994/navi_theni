import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./AddJob.css";

const AddJob = () => {
  const [formData, setFormData] = useState({
    jobName: "",
    title: "",
    salary: "",
    qualification: "",
    description: "",
    mode: "onsite",
    skills: "",
    applicationLink: "",
    storeId: "", // store _id
    location: { district: "", city: "", pincode: "" },
    logo: "",
    phoneNumber: ""
  });

  const [storeInput, setStoreInput] = useState("");
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputRef = useRef();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get("https://navi-theni-2.onrender.com/api/stores");
        setStores(res.data);
        setFilteredStores(res.data);
      } catch (err) {
        console.error("Error fetching stores:", err);
      }
    };
    fetchStores();
  }, []);

  const handleStoreInput = (e) => {
    const value = e.target.value;
    setStoreInput(value);
    if (value) {
      const filtered = stores.filter((store) =>
        store.storeName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStores(filtered);
      setShowDropdown(true);
    } else {
      setFilteredStores(stores);
      setShowDropdown(false);
    }
    setFormData({ ...formData, storeId: "" });
  };

  const selectStore = (store) => {
    setFormData({
      ...formData,
      storeId: store._id,
      location: store.location,
      logo: store.logoImage,
      phoneNumber: store.phonenumber
    });
    setStoreInput(store.storeName);
    setShowDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "district" || name === "city" || name === "pincode") {
      setFormData({
        ...formData,
        location: { ...formData.location, [name]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(","),
        storeName: formData.storeId || storeInput
      };
      const res = await axios.post("https://navi-theni-2.onrender.com/api/jobs", payload);
      alert("Job created successfully!");
      console.log(res.data);
      setFormData({
        jobName: "",
        title: "",
        salary: "",
        qualification: "",
        description: "",
        mode: "onsite",
        skills: "",
        applicationLink: "",
        storeId: "",
        location: { district: "", city: "", pincode: "" },
        logo: "",
        phoneNumber: ""
      });
      setStoreInput("");
    } catch (err) {
      console.error("Error creating job:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error creating job");
    }
  };

  const existingStore = stores.find(store => store._id === formData.storeId);

  return (
    <div className="add-job-container">
      <h2>Add Job</h2>
      <form onSubmit={handleSubmit}>
        {/* ===== Store Field ===== */}
        <label>Store:</label>
        <div className="store-input-wrapper">
          <input
            type="text"
            placeholder="Type or select store"
            value={storeInput}
            onChange={handleStoreInput}
            onFocus={() => setShowDropdown(true)}
            ref={inputRef}
            autoComplete="off"
            required
          />
          {showDropdown && filteredStores.length > 0 && (
            <ul className="store-dropdown">
              {filteredStores.map((store) => (
                <li key={store._id} onClick={() => selectStore(store)}>
                  {store.storeName}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ===== New store fields if store not exists ===== */}
        {!existingStore && storeInput && (
          <>
            <label>District:</label>
            <input type="text" name="district" value={formData.location.district} onChange={handleChange} required />

            <label>City:</label>
            <input type="text" name="city" value={formData.location.city} onChange={handleChange} required />

            <label>Pincode:</label>
            <input type="text" name="pincode" value={formData.location.pincode} onChange={handleChange} required />

            <label>Logo URL:</label>
            <input type="text" name="logo" value={formData.logo} onChange={handleChange} required />

            <label>Phone Number:</label>
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          </>
        )}

        {/* ===== Rest of Job Fields ===== */}
        <label>Job Name:</label>
        <input type="text" name="jobName" value={formData.jobName} onChange={handleChange} required />

        <label>Title:</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />

        <label>Salary:</label>
        <input type="text" name="salary" value={formData.salary} onChange={handleChange} />

        <label>Qualification:</label>
        <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} />

        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />

        <label>Mode:</label>
        <select name="mode" value={formData.mode} onChange={handleChange}>
          <option value="onsite">Onsite</option>
          <option value="remote">Remote</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <label>Skills (comma separated):</label>
        <input type="text" name="skills" value={formData.skills} onChange={handleChange} />

        <label>Application Link:</label>
        <input type="text" name="applicationLink" value={formData.applicationLink} onChange={handleChange} />

        <button type="submit">Add Job</button>
      </form>
    </div>
  );
};

export default AddJob;
