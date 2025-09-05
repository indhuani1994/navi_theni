import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminAdds.css"

const AdminAdds = () => {
  const [ads, setAds] = useState([]);
  const [editingAdId, setEditingAdId] = useState(null);
  const [formData, setFormData] = useState({
    category: "hero",
    hero: { image: null, title: "", description: "", buttonName: "", buttonUrl: "", btnBackgroundColor: "" },
    strap: { image: null },
    coupon: { image: null },
    slider: { logoImage: null, title: "", content: "", buttonName: "", buttonColor: "", buttonUrl: "", buttonBackgroundColor: "" },
  });

  // Fetch all ads
  const fetchAds = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/ads");
      setAds(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // Start editing ad
  const startEdit = (ad) => {
    setEditingAdId(ad._id);
    setFormData({
      category: ad.category,
      hero: ad.hero || { image: null, title: "", description: "", buttonName: "", buttonUrl: "", btnBackgroundColor: "" },
      strap: ad.strap || { image: null },
      coupon: ad.coupon || { image: null },
      slider: ad.slider || { logoImage: null, title: "", content: "", buttonName: "", buttonColor: "", buttonUrl: "", buttonBackgroundColor: "" },
    });
  };

  // Input change
  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    setFormData((prev) => type ? { ...prev, [type]: { ...prev[type], [name]: value } } : { ...prev, [name]: value });
  };

  // File change
  const handleFileChange = (e, type, field) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, [type]: { ...prev[type], [field]: file } }));
  };

  // Submit edited ad
  const submitEdit = async () => {
    try {
      const fd = new FormData();
      fd.append("category", formData.category);

      if (formData.category === "hero") {
        fd.append("hero", JSON.stringify({
          title: formData.hero.title,
          description: formData.hero.description,
          buttonName: formData.hero.buttonName,
          buttonUrl: formData.hero.buttonUrl,
          btnBackgroundColor: formData.hero.btnBackgroundColor,
        }));
        if (formData.hero.image) fd.append("hero[image]", formData.hero.image);
      }

      if (formData.category === "strap" && formData.strap.image) fd.append("strap[image]", formData.strap.image);
      if (formData.category === "coupon" && formData.coupon.image) fd.append("coupon[image]", formData.coupon.image);

      if (formData.category === "slider") {
        fd.append("slider", JSON.stringify({
          title: formData.slider.title,
          content: formData.slider.content,
          buttonName: formData.slider.buttonName,
          buttonColor: formData.slider.buttonColor,
          buttonUrl: formData.slider.buttonUrl,
          buttonBackgroundColor: formData.slider.buttonBackgroundColor,
        }));
        if (formData.slider.logoImage) fd.append("slider[logoImage]", formData.slider.logoImage);
      }

      await axios.put(`http://localhost:4000/api/ads/${editingAdId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Advertisement updated successfully!");
      setEditingAdId(null);
      fetchAds();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error updating ad");
    }
  };

  // Delete ad
  const deleteAd = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/ads/${id}`);
      fetchAds();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="ads-list">
      {ads.map((ad) => (
        <div key={ad._id} className="ad-item">
          {editingAdId === ad._id ? (
            <div className="edit-form-container">
              <h3>Edit Advertisement</h3>

              <div className="form-group">
                <label>Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                  <option value="hero">Hero</option>
                  <option value="strap">Strap</option>
                  <option value="coupon">Coupon</option>
                  <option value="slider">Slider</option>
                </select>
              </div>

              {formData.category === "hero" && (
                <>
                  <div className="form-group">
                    <label>Title</label>
                    <input type="text" name="title" value={formData.hero.title} onChange={(e) => handleInputChange(e, "hero")} />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input type="text" name="description" value={formData.hero.description} onChange={(e) => handleInputChange(e, "hero")} />
                  </div>
                  <div className="form-group">
                    <label>Button Name</label>
                    <input type="text" name="buttonName" value={formData.hero.buttonName} onChange={(e) => handleInputChange(e, "hero")} />
                  </div>
                  <div className="form-group">
                    <label>Button URL</label>
                    <input type="text" name="buttonUrl" value={formData.hero.buttonUrl} onChange={(e) => handleInputChange(e, "hero")} />
                  </div>
                  <div className="form-group">
                    <label>Button Background Color</label>
                    <input type="text" name="btnBackgroundColor" value={formData.hero.btnBackgroundColor} onChange={(e) => handleInputChange(e, "hero")} />
                  </div>
                  <div className="form-group">
                    <label>Image</label>
                    <input type="file" onChange={(e) => handleFileChange(e, "hero", "image")} />
                  </div>
                </>
              )}

              {formData.category === "strap" && (
                <div className="form-group">
                  <label>Image</label>
                  <input type="file" onChange={(e) => handleFileChange(e, "strap", "image")} />
                </div>
              )}

              {formData.category === "coupon" && (
                <div className="form-group">
                  <label>Image</label>
                  <input type="file" onChange={(e) => handleFileChange(e, "coupon", "image")} />
                </div>
              )}

              {formData.category === "slider" && (
                <>
                  <div className="form-group">
                    <label>Title</label>
                    <input type="text" name="title" value={formData.slider.title} onChange={(e) => handleInputChange(e, "slider")} />
                  </div>
                  <div className="form-group">
                    <label>Content</label>
                    <input type="text" name="content" value={formData.slider.content} onChange={(e) => handleInputChange(e, "slider")} />
                  </div>
                  <div className="form-group">
                    <label>Button Name</label>
                    <input type="text" name="buttonName" value={formData.slider.buttonName} onChange={(e) => handleInputChange(e, "slider")} />
                  </div>
                  <div className="form-group">
                    <label>Button Color</label>
                    <input type="text" name="buttonColor" value={formData.slider.buttonColor} onChange={(e) => handleInputChange(e, "slider")} />
                  </div>
                  <div className="form-group">
                    <label>Button URL</label>
                    <input type="text" name="buttonUrl" value={formData.slider.buttonUrl} onChange={(e) => handleInputChange(e, "slider")} />
                  </div>
                  <div className="form-group">
                    <label>Button Background Color</label>
                    <input type="text" name="buttonBackgroundColor" value={formData.slider.buttonBackgroundColor} onChange={(e) => handleInputChange(e, "slider")} />
                  </div>
                  <div className="form-group">
                    <label>Logo Image</label>
                    <input type="file" onChange={(e) => handleFileChange(e, "slider", "logoImage")} />
                  </div>
                </>
              )}

              <div className="form-buttons">
                <button className="save-btn" onClick={submitEdit}>Save</button>
                <button className="cancel-btn" onClick={() => setEditingAdId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <h3>Category: {ad.category.toUpperCase()}</h3>
              {ad.category === "hero" && ad.hero && (
                <div>
                  {ad.hero.image && <img src={`http://localhost:4000/${ad.hero.image}`} alt="hero" />}
                  <p><strong>Title:</strong> {ad.hero.title}</p>
                  <p><strong>Description:</strong> {ad.hero.description}</p>
                  <p><strong>Button Name:</strong> {ad.hero.buttonName}</p>
                  <p><strong>Button URL:</strong> {ad.hero.buttonUrl}</p>
                  <p><strong>Button Background Color:</strong> {ad.hero.btnBackgroundColor}</p>
                </div>
              )}

              {ad.category === "strap" && ad.strap?.image && <img src={`http://localhost:4000/${ad.strap.image}`} alt="strap" />}
              {ad.category === "coupon" && ad.coupon?.image && <img src={`http://localhost:4000/${ad.coupon.image}`} alt="coupon" />}
              
              {ad.category === "slider" && ad.slider && (
                <div>
                  {ad.slider.logoImage && <img src={`http://localhost:4000/${ad.slider.logoImage}`} alt="slider logo" />}
                  <p><strong>Title:</strong> {ad.slider.title}</p>
                  <p><strong>Content:</strong> {ad.slider.content}</p>
                  <p><strong>Button Name:</strong> {ad.slider.buttonName}</p>
                  <p><strong>Button URL:</strong> {ad.slider.buttonUrl}</p>
                  <p><strong>Button Color:</strong> {ad.slider.buttonColor}</p>
                  <p><strong>Button Background Color:</strong> {ad.slider.buttonBackgroundColor}</p>
                </div>
              )}

              <p><strong>Created At:</strong> {new Date(ad.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(ad.updatedAt).toLocaleString()}</p>
              <button className="edit-btn" onClick={() => startEdit(ad)}>Edit</button>
              <button className="delete-btn" onClick={() => deleteAd(ad._id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminAdds;
