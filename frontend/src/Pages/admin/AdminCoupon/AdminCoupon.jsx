import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminCoupon.css";

const AdminCoupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
 


  // Fetch all coupons
  const fetchCoupons = async () => {
    try {
      const res = await axios.get("https://navi-theni-2.onrender.com/api/coupons");
      setCoupons(res.data);
    } catch (err) {
      console.error("Error fetching coupons:", err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleNestedChange = (e, parent) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [parent]: { ...editData[parent], [name]: value },
    });
    
    // Clear error when user starts typing
    if (errors[`${parent}.${name}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${parent}.${name}`];
      setErrors(newErrors);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!editData.couponCode?.trim()) {
      newErrors.couponCode = "Coupon code is required";
    }
    
    if (!editData.description?.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!editData.termsAndCondition?.trim()) {
      newErrors.termsAndCondition = "Terms and conditions are required";
    }
    
    if (!editData.expiredDate) {
      newErrors.expiredDate = "Expiry date is required";
    } else if (new Date(editData.expiredDate) < new Date()) {
      newErrors.expiredDate = "Expiry date must be in the future";
    }
    
    // Offer title validation
    if (!editData.offerTitle?.highlight?.trim()) {
      newErrors["offerTitle.highlight"] = "Offer highlight is required";
    }
    
    // Location validation
    if (!editData.location?.district?.trim()) {
      newErrors["location.district"] = "District is required";
    }
    
    if (!editData.location?.city?.trim()) {
      newErrors["location.city"] = "City is required";
    }
    
    if (!editData.location?.pincode?.trim()) {
      newErrors["location.pincode"] = "Pincode is required";
    } else if (!/^\d{6}$/.test(editData.location.pincode)) {
      newErrors["location.pincode"] = "Pincode must be 6 digits";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Start editing
 const startEdit = (coupon) => {
  setEditingId(coupon._id);
  setEditData({
    ...coupon,
    offerTitle: coupon.offerTitle || { highlight: "", normal: "" },
    location: coupon.location || coupon.storeInfo?.location || { district: "", city: "", pincode: "" },
    storeName: coupon.storeName?._id || coupon.storeInfo?.storeName || "",
    plan: coupon.plan || coupon.storeInfo?.plan || "",
    category: coupon.category || coupon.storeInfo?.category || "",
    couponId: coupon.couponId || "",   // ✅ this keeps the selected coupon
  });
  setImageFile(null);
  setPosterFile(null);
  setErrors({});
  setSuccessMessage("");
};


  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
    setImageFile(null);
    setPosterFile(null);
    setErrors({});
    setSuccessMessage("");
  };

  // Submit edit
 // Submit edit - enhanced error handling
const submitEdit = async () => {
  if (!validateForm()) {
    return;
  }
  
  setIsSubmitting(true);
  try {
    const formData = new FormData();

    // Basic fields
    formData.append("couponCode", editData.couponCode || "");
    formData.append("description", editData.description || "");
    formData.append("termsAndCondition", editData.termsAndCondition || "");
    formData.append("expiredDate", editData.expiredDate || "");
    
    // Handle store name - check if it's an existing store or new store
    if (editData.storeName) {
      if (typeof editData.storeName === 'object' && editData.storeName._id) {
        // Existing store - send ObjectId
        formData.append("storeName", editData.storeName._id);
      } else {
        // New store - send string name and include additional required fields
        formData.append("storeName", editData.storeName);
        formData.append("category", editData.category || "");
        formData.append("plan", editData.plan || "");
        
        // Location is already handled in the nested section
      }
    }

    // Stringify nested objects
    if (editData.offerTitle) {
      formData.append("offerTitle", JSON.stringify(editData.offerTitle));
    }
    
    if (editData.location) {
      formData.append("location", JSON.stringify(editData.location));
    }

    if (editData.couponId) {
  formData.append("couponId", editData.couponId);
}


    // Files
    if (imageFile) formData.append("image", imageFile);
    if (posterFile) formData.append("addsPoster", posterFile);
    if (editData.watermarkFile) {
  formData.append("watermarkImage", editData.watermarkFile);
}


    const response = await axios.put(
      `https://navi-theni-2.onrender.com/api/coupons/${editingId}`, 
      formData, 
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    setSuccessMessage("Coupon updated successfully!");
    setTimeout(() => {
      fetchCoupons();
      cancelEdit();
    }, 1500);
  } catch (err) {
    console.error("Error updating coupon:", err);
    
    if (err.response?.status === 400) {
      setErrors({ submit: err.response.data.message || "Invalid data format" });
    } else if (err.response?.data?.errors) {
      const serverErrors = {};
      err.response.data.errors.forEach(error => {
        serverErrors[error.path] = error.msg;
      });
      setErrors(serverErrors);
    } else if (err.response?.data?.error) {
      setErrors({ submit: err.response.data.error });
    } else {
      setErrors({ submit: "Failed to update coupon. Please try again." });
    }
  } finally {
    setIsSubmitting(false);
  }
};
  // Delete coupon
  const deleteCoupon = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await axios.delete(`https://navi-theni-2.onrender.com/api/coupons/${id}`);
        setSuccessMessage("Coupon deleted successfully!");
        setTimeout(() => {
          fetchCoupons();
          setSuccessMessage("");
        }, 1500);
      } catch (err) {
        console.error("Error deleting coupon:", err);
        setErrors({ submit: "Failed to delete coupon. Please try again." });
      }
    }
  };

  // Handle file changes with validation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: "Please select an image file" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ ...errors, image: "Image size must be less than 5MB" });
        return;
      }
      setImageFile(file);
      setErrors({ ...errors, image: "" });
    }
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, poster: "Please select an image file" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors({ ...errors, poster: "Poster size must be less than 5MB" });
        return;
      }
      setPosterFile(file);
      setErrors({ ...errors, poster: "" });
    }
  };

  return (
    <div className="admin-coupon-container">
      <h2>Coupons List</h2>
      
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      
      {errors.submit && (
        <div className="error-message">{errors.submit}</div>
      )}
      
      <table className="coupon-table">
        <thead>
          <tr>
            <th>Store</th>
            <th>Plan</th>
            <th>Category</th>
            <th>Location</th>
            <th>Coupon Code</th>
            <th>Offer Highlight</th>
            <th>Offer Normal</th>
            <th>Expired Date</th>
            <th>Image</th>
            <th>Poster</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <React.Fragment key={coupon._id}>
              <tr>
                <td>{coupon.storeName?.storeName || coupon.storeInfo?.storeName || "-"}</td>
                <td>{coupon.plan || coupon.storeInfo?.plan || "-"}</td>
                <td>{coupon.category || coupon.storeInfo?.category || "-"}</td>
                <td>
                  {coupon.location
                    ? `${coupon.location.district}, ${coupon.location.city}, ${coupon.location.pincode}`
                    : coupon.storeInfo?.location
                      ? `${coupon.storeInfo.location.district}, ${coupon.storeInfo.location.city}, ${coupon.storeInfo.location.pincode}`
                      : "-"}
                </td>
                <td>{coupon.couponCode}</td>
                <td>{coupon.offerTitle?.highlight || "-"}</td>
                <td>{coupon.offerTitle?.normal || "-"}</td>
                <td>{coupon.expiredDate ? new Date(coupon.expiredDate).toLocaleDateString() : "-"}</td>
                <td>
                  {coupon.image && <img src={`https://navi-theni-2.onrender.com${coupon.image}`} alt="Coupon" width="80" />}
                </td>
                <td>
                  {coupon.addsPoster && <img src={`https://navi-theni-2.onrender.com${coupon.addsPoster}`} alt="Poster" width="80" />}
                </td>
                <td>
                  <button className="edit-btn" onClick={() => startEdit(coupon)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteCoupon(coupon._id)}>Delete</button>
                </td>
              </tr>

              {editingId === coupon._id && (
                <tr className="edit-row">
                  <td colSpan="11">
                    <div className="edit-form">
                      <h3>Edit Coupon</h3>
                      
                      <div className="form-group">
                        <label>Coupon Code *</label>
                        <input 
                          type="text" 
                          name="couponCode" 
                          placeholder="Coupon Code" 
                          value={editData.couponCode || ""} 
                          onChange={handleChange}
                          className={errors.couponCode ? "error" : ""}
                        />
                        {errors.couponCode && <span className="error-text">{errors.couponCode}</span>}
                      </div>
                      
                      <div className="form-group">
                        <label>Description *</label>
                        <textarea 
                          name="description" 
                          placeholder="Description" 
                          value={editData.description || ""} 
                          onChange={handleChange}
                          className={errors.description ? "error" : ""}
                          rows="3"
                        />
                        {errors.description && <span className="error-text">{errors.description}</span>}
                      </div>
                      
                      <div className="form-group">
                        <label>Terms & Conditions *</label>
                        <textarea 
                          name="termsAndCondition" 
                          placeholder="Terms & Conditions" 
                          value={editData.termsAndCondition || ""} 
                          onChange={handleChange}
                          className={errors.termsAndCondition ? "error" : ""}
                          rows="3"
                        />
                        {errors.termsAndCondition && <span className="error-text">{errors.termsAndCondition}</span>}
                      </div>
                      
                      <div className="form-group">
                        <label>Expired Date *</label>
                        <input 
                          type="date" 
                          name="expiredDate" 
                          placeholder="Expired Date" 
                          value={editData.expiredDate ? editData.expiredDate.split("T")[0] : ""} 
                          onChange={handleChange}
                          className={errors.expiredDate ? "error" : ""}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        {errors.expiredDate && <span className="error-text">{errors.expiredDate}</span>}
                      </div>

                      <div className="form-section">
                        <h4>Offer Title</h4>
                        
                        <div className="form-group">
                          <label>Highlight *</label>
                          <input 
                            type="text" 
                            name="highlight" 
                            placeholder="Highlight" 
                            value={editData.offerTitle?.highlight || ""} 
                            onChange={(e) => handleNestedChange(e, "offerTitle")}
                            className={errors["offerTitle.highlight"] ? "error" : ""}
                          />
                          {errors["offerTitle.highlight"] && <span className="error-text">{errors["offerTitle.highlight"]}</span>}
                        </div>
                        
                        <div className="form-group">
                          <label>Normal</label>
                          <input 
                            type="text" 
                            name="normal" 
                            placeholder="Normal" 
                            value={editData.offerTitle?.normal || ""} 
                            onChange={(e) => handleNestedChange(e, "offerTitle")}
                          />
                        </div>
                      </div>

                      <div className="form-section">
                        <h4>Location</h4>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label>District *</label>
                            <input 
                              type="text" 
                              name="district" 
                              placeholder="District" 
                              value={editData.location?.district || ""} 
                              onChange={(e) => handleNestedChange(e, "location")}
                              className={errors["location.district"] ? "error" : ""}
                            />
                            {errors["location.district"] && <span className="error-text">{errors["location.district"]}</span>}
                          </div>
                          
                          <div className="form-group">
                            <label>City *</label>
                            <input 
                              type="text" 
                              name="city" 
                              placeholder="City" 
                              value={editData.location?.city || ""} 
                              onChange={(e) => handleNestedChange(e, "location")}
                              className={errors["location.city"] ? "error" : ""}
                            />
                            {errors["location.city"] && <span className="error-text">{errors["location.city"]}</span>}
                          </div>
                          
                          <div className="form-group">
                            <label>Pincode *</label>
                            <input 
                              type="text" 
                              name="pincode" 
                              placeholder="Pincode" 
                              value={editData.location?.pincode || ""} 
                              onChange={(e) => handleNestedChange(e, "location")}
                              className={errors["location.pincode"] ? "error" : ""}
                              maxLength="6"
                            />
                            {errors["location.pincode"] && <span className="error-text">{errors["location.pincode"]}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="form-section">
                        <h4>Images</h4>
                        

                        <div className="form-group">
  <label>Watermark Image</label>
  <input 
    type="file" 
    accept="image/*" 
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          setErrors({ ...errors, watermark: "Please select an image file" });
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setErrors({ ...errors, watermark: "Watermark size must be less than 5MB" });
          return;
        }
        setEditData({ ...editData, watermarkFile: file });
        setErrors({ ...errors, watermark: "" });
      }
    }}
    className={errors.watermark ? "error" : ""}
  />
  {errors.watermark && <span className="error-text">{errors.watermark}</span>}
  {editData.watermarkImage && !editData.watermarkFile && (
    <div className="current-file">
      Current: <img src={`https://navi-theni-2.onrender.com${editData.watermarkImage}`} alt="Current Watermark" width="40" />
    </div>
  )}
</div>

<div className="form-group">
  <label>Select Coupon *</label>
  <select
    name="couponId"
    value={editData.couponId || ""}
    onChange={(e) =>
      setEditData({ ...editData, couponId: e.target.value })
    }
    className="form-input"
  >
    <option value="">-- Select Coupon --</option>
    {coupons.map((c) => (
      <option key={c._id} value={c._id}>
        {c.couponCode} - {c.offerTitle?.highlight}
      </option>
    ))}
  </select>
</div>

{editData.couponId && (
  <div className="coupon-preview-box">
    <img
      src={`https://navi-theni-2.onrender.com${
        coupons.find((c) => c._id === editData.couponId)?.image
      }`}
      alt="Coupon Preview"
      width="120"
      className="coupon-preview"
    />
  </div>
)}


                        <div className="form-row">
                          <div className="form-group">
                            <label>Coupon Image</label>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleImageChange}
                              className={errors.image ? "error" : ""}
                            />
                            {errors.image && <span className="error-text">{errors.image}</span>}
                            {editData.image && !imageFile && (
                              <div className="current-file">
                                Current: <img src={`https://navi-theni-2.onrender.com${editData.image}`} alt="Current" width="40" />
                              </div>
                            )}
                          </div>
                          
                          <div className="form-group">
                            <label>Poster Image</label>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handlePosterChange}
                              className={errors.poster ? "error" : ""}
                            />
                            {errors.poster && <span className="error-text">{errors.poster}</span>}
                            {editData.addsPoster && !posterFile && (
                              <div className="current-file">
                                Current: <img src={`https://navi-theni-2.onrender.com${editData.addsPoster}`} alt="Current Poster" width="40" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-buttons">
                        <button 
                          className="save-btn" 
                          onClick={submitEdit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                        <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCoupon;