import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import './CouponForm.css'; // Import CSS file

const CouponForm = () => {
  const [formData, setFormData] = useState({
    storeName: "",
    couponCode: "",
    offerHighlight: "",
    offerNormal: "",
    description: "",
    termsAndCondition: "",
    expiredDate: "",
    shareLink: "",
    watermarkImage: "",
    category: "",
    plan: "",
    district: "",
    city: "",
    pincode: "",
  });

  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [image, setImage] = useState(null);
  const [addsPoster, setAddsPoster] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewPoster, setPreviewPoster] = useState(null);

  const inputRef = useRef();

  const existingStore = stores.find(s => s.storeName === formData.storeName);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/stores");
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
    setFormData({ ...formData, storeName: value });
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
  };

  const selectStore = (store) => {
    setFormData({
      ...formData,
      storeName: store.storeName,
      category: store.category,
      plan: store.plan,
      district: store.location?.district || "",
      city: store.location?.city || "",
      pincode: store.location?.pincode || "",
    });
    setShowDropdown(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    setAddsPoster(file);
    setPreviewPoster(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "offerHighlight" || key === "offerNormal") {
        if (key === "offerHighlight") data.append("offerTitle[highlight]", formData[key]);
        if (key === "offerNormal") data.append("offerTitle[normal]", formData[key]);
      } else if (key === "district" || key === "city" || key === "pincode") {
        data.append(`location[${key}]`, formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    });

    if (image) data.append("image", image);
    if (addsPoster) data.append("addsPoster", addsPoster);

    try {
      const res = await axios.post("http://localhost:4000/api/coupons", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.coupon) {
        alert("Coupon created successfully!");
        setFormData({
          storeName: "",
          couponCode: "",
          offerHighlight: "",
          offerNormal: "",
          description: "",
          termsAndCondition: "",
          expiredDate: "",
          shareLink: "",
          watermarkImage: "",
          category: "",
          plan: "",
          district: "",
          city: "",
          pincode: "",
        });
        setImage(null);
        setAddsPoster(null);
        setPreviewImage(null);
        setPreviewPoster(null);
      }
    } catch (err) {
      console.error("Error creating coupon:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error creating coupon");
    }
  };

  return (
    <div className="coupon-form-container">
      <h2 className="form-title">Create Coupon</h2>
      <form className="coupon-form" onSubmit={handleSubmit} encType="multipart/form-data">
        
        <label>Store Name:</label>
        <input
          type="text"
          name="storeName"
          placeholder="Type or select store"
          value={formData.storeName}
          onChange={handleStoreInput}
          onFocus={() => setShowDropdown(true)}
          autoComplete="off"
          ref={inputRef}
          className="form-input"
          required
        />

        {showDropdown && filteredStores.length > 0 && (
          <ul className="coupon-dropdown">
            {filteredStores.map((store) => (
              <li key={store._id} onClick={() => selectStore(store)}>{store.storeName}</li>
            ))}
          </ul>
        )}

        {!existingStore && formData.storeName && (
          <div className="additional-fields">
            <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="form-input" required/>
            <input type="text" name="plan" placeholder="Plan (platinum/diamond/gold)" value={formData.plan} onChange={handleChange} className="form-input" required/>
            <input type="text" name="district" placeholder="District" value={formData.district} onChange={handleChange} className="form-input" required/>
            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="form-input" required/>
            <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} className="form-input" required/>
          </div>
        )}

        <input type="text" name="couponCode" placeholder="Coupon Code" value={formData.couponCode} onChange={handleChange} className="form-input" required/>
        <input type="text" name="offerHighlight" placeholder="Offer Highlight" value={formData.offerHighlight} onChange={handleChange} className="form-input" required/>
        <input type="text" name="offerNormal" placeholder="Offer Normal" value={formData.offerNormal} onChange={handleChange} className="form-input"/>
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="form-textarea"/>
        <textarea name="termsAndCondition" placeholder="Terms & Conditions" value={formData.termsAndCondition} onChange={handleChange} className="form-textarea"/>
        <input type="date" name="expiredDate" value={formData.expiredDate} onChange={handleChange} className="form-input" required/>
        <input type="text" name="shareLink" placeholder="Share Link" value={formData.shareLink} onChange={handleChange} className="form-input"/>
        <input type="text" name="watermarkImage" placeholder="Watermark Image URL" value={formData.watermarkImage} onChange={handleChange} className="form-input"/>
        
        <label>Coupon Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="form-file"/>
        {previewImage && <img src={previewImage} alt="Preview" className="coupon-preview"/>}

        <label>Adds Poster:</label>
        <input type="file" accept="image/*" onChange={handlePosterChange} className="form-file"/>
        {previewPoster && <img src={previewPoster} alt="Preview Poster" className="coupon-preview"/>}

        <button type="submit" className="form-button">Create Coupon</button>
      </form>
    </div>
  );
};

export default CouponForm;
