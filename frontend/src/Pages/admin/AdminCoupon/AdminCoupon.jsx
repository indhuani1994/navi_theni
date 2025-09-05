import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminCoupon.css";

const AdminCoupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [posterFile, setPosterFile] = useState(null);

  // Fetch all coupons
  const fetchCoupons = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/coupons");
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
  };

  const handleNestedChange = (e, parent) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [parent]: { ...editData[parent], [name]: value },
    });
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
  });
  setImageFile(null);
  setPosterFile(null);
};


  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
    setImageFile(null);
    setPosterFile(null);
  };

  // Submit edit
  const submitEdit = async () => {
    try {
      const formData = new FormData();

      // Basic fields
      formData.append("couponCode", editData.couponCode || "");
      formData.append("description", editData.description || "");
      formData.append("termsAndCondition", editData.termsAndCondition || "");
      formData.append("expiredDate", editData.expiredDate || "");
      formData.append("storeName", editData.storeName?._id || editData.storeName);

      // Nested objects
      formData.append("offerTitle", JSON.stringify(editData.offerTitle));
      formData.append("location", JSON.stringify(editData.location));

      // Files
      if (imageFile) formData.append("image", imageFile);
      if (posterFile) formData.append("addsPoster", posterFile);

      await axios.put(`http://localhost:4000/api/coupons/${editingId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchCoupons();
      cancelEdit();
    } catch (err) {
      console.error("Error updating coupon:", err);
    }
  };

  // Delete coupon
  const deleteCoupon = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await axios.delete(`http://localhost:4000/api/coupons/${id}`);
        fetchCoupons();
      } catch (err) {
        console.error("Error deleting coupon:", err);
      }
    }
  };

  return (
    <div className="admin-coupon-container">
      <h2>Coupons List</h2>
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
                  {coupon.image && <img src={`http://localhost:4000${coupon.image}`} alt="Coupon" width="80" />}
                </td>
                <td>
                  {coupon.addsPoster && <img src={`http://localhost:4000${coupon.addsPoster}`} alt="Poster" width="80" />}
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
                      <input type="text" name="couponCode" placeholder="Coupon Code" value={editData.couponCode || ""} onChange={handleChange} />
                      <input type="text" name="description" placeholder="Description" value={editData.description || ""} onChange={handleChange} />
                      <input type="text" name="termsAndCondition" placeholder="Terms & Conditions" value={editData.termsAndCondition || ""} onChange={handleChange} />
                      <input type="date" name="expiredDate" placeholder="Expired Date" value={editData.expiredDate ? editData.expiredDate.split("T")[0] : ""} onChange={handleChange} />

                      <h4>Offer Title</h4>
                      <input type="text" name="highlight" placeholder="Highlight" value={editData.offerTitle?.highlight || ""} onChange={(e) => handleNestedChange(e, "offerTitle")} />
                      <input type="text" name="normal" placeholder="Normal" value={editData.offerTitle?.normal || ""} onChange={(e) => handleNestedChange(e, "offerTitle")} />

                      <h4>Location</h4>
                      <input type="text" name="district" placeholder="District" value={editData.location?.district || ""} onChange={(e) => handleNestedChange(e, "location")} />
                      <input type="text" name="city" placeholder="City" value={editData.location?.city || ""} onChange={(e) => handleNestedChange(e, "location")} />
                      <input type="text" name="pincode" placeholder="Pincode" value={editData.location?.pincode || ""} onChange={(e) => handleNestedChange(e, "location")} />

                      <h4>Images</h4>
                      <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
                      <input type="file" onChange={(e) => setPosterFile(e.target.files[0])} />

                      <div className="form-buttons">
                        <button className="save-btn" onClick={submitEdit}>Save</button>
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
