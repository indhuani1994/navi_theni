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
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [watermarkImage, setWatermarkImage] = useState(null);
const [previewWatermark, setPreviewWatermark] = useState(null);
const [coupons, setCoupons] = useState([]);



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

  useEffect(() => {
  const fetchCoupons = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/ads");
      // Filter only coupons
      const couponAds = res.data.filter(ad => ad.category === "coupon");
      setCoupons(couponAds);
    } catch (err) {
      console.error("Error fetching coupons:", err);
    }
  };
  fetchCoupons();
}, []);


  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    if (!formData.storeName.trim()) newErrors.storeName = "Store name is required";
    if (!formData.couponCode.trim()) newErrors.couponCode = "Coupon code is required";
    if (!formData.offerHighlight.trim()) newErrors.offerHighlight = "Offer highlight is required";
    if (!formData.expiredDate) newErrors.expiredDate = "Expiry date is required";
    
    // Date validation - check if date is in the future
    if (formData.expiredDate) {
      const today = new Date();
      const expiryDate = new Date(formData.expiredDate);
      if (expiryDate <= today) {
        newErrors.expiredDate = "Expiry date must be in the future";
      }
    }
    
    // URL validation for shareLink and watermarkImage
    if (formData.shareLink && !isValidUrl(formData.shareLink)) {
      newErrors.shareLink = "Please enter a valid URL";
    }
    
  if (!watermarkImage && !previewWatermark) {
  newErrors.watermarkImage = "Watermark image is required";
}

    
    // Plan validation
    if (!existingStore && formData.storeName) {
      if (!formData.category.trim()) newErrors.category = "Category is required";
      if (!formData.plan.trim()) newErrors.plan = "Plan is required";
      else if (!["platinum", "diamond", "gold"].includes(formData.plan.toLowerCase())) {
        newErrors.plan = "Plan must be platinum, diamond, or gold";
      }
      if (!formData.district.trim()) newErrors.district = "District is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
      else if (!/^\d{6}$/.test(formData.pincode)) {
        newErrors.pincode = "Pincode must be 6 digits";
      }
    }
    
   // Coupon validation
if (!formData.selectedCoupon) {
  // User did not select an existing coupon → require image
  if (!image && !previewImage) {
    newErrors.image = "Coupon image is required if no coupon is selected";
  }
}

    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };


  const handleWatermarkChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setWatermarkImage(file);
    setPreviewWatermark(URL.createObjectURL(file));
    if (errors.watermarkImage) {
      setErrors({ ...errors, watermarkImage: "" });
    }
  }
};


  const handleStoreInput = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, storeName: value });
    
    // Clear error when user starts typing
    if (errors.storeName) {
      setErrors({ ...errors, storeName: "" });
    }
    
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
    
    // Clear any existing store-related errors
    const newErrors = { ...errors };
    delete newErrors.category;
    delete newErrors.plan;
    delete newErrors.district;
    delete newErrors.city;
    delete newErrors.pincode;
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        setErrors({ ...errors, image: "Please select a valid image file (JPEG, PNG, GIF, WEBP)" });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 5MB" });
        return;
      }
      
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
      
      // Clear error when user selects a valid file
      if (errors.image) {
        setErrors({ ...errors, image: "" });
      }
    }
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        setErrors({ ...errors, addsPoster: "Please select a valid image file (JPEG, PNG, GIF, WEBP)" });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, addsPoster: "Image size should be less than 5MB" });
        return;
      }
      
      setAddsPoster(file);
      setPreviewPoster(URL.createObjectURL(file));
      
      // Clear error when user selects a valid file
      if (errors.addsPoster) {
        setErrors({ ...errors, addsPoster: "" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const element = document.querySelector(`[name="${firstError}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }
    
    setIsSubmitting(true);

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

// Either existing coupon OR new image
if (formData.selectedCoupon) {
  data.append("selectedCoupon", formData.selectedCoupon);
} else {
  if (image) data.append("image", image);
}

if (addsPoster) data.append("addsPoster", addsPoster);
if (watermarkImage) data.append("watermarkImage", watermarkImage);



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
        setErrors({});
      }
    } catch (err) {
      console.error("Error creating coupon:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error creating coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="coupon-form-container">
      <h2 className="form-title">Create Coupon</h2>
      <form className="coupon-form" onSubmit={handleSubmit} encType="multipart/form-data">
        
        <div className="form-group">
          <label>Store Name *</label>
          <input
            type="text"
            name="storeName"
            placeholder="Type or select store"
            value={formData.storeName}
            onChange={handleStoreInput}
            onFocus={() => setShowDropdown(true)}
            autoComplete="off"
            ref={inputRef}
            className={`form-input ${errors.storeName ? 'error' : ''}`}
          />
          {errors.storeName && <span className="error-text">{errors.storeName}</span>}

          {showDropdown && filteredStores.length > 0 && (
            <ul className="coupon-dropdown">
              {filteredStores.map((store) => (
                <li key={store._id} onClick={() => selectStore(store)}>{store.storeName}</li>
              ))}
            </ul>
          )}
        </div>

        {!existingStore && formData.storeName && (
          <div className="additional-fields">
            <div className="form-group">
              <input 
                type="text" 
                name="category" 
                placeholder="Category *" 
                value={formData.category} 
                onChange={handleChange} 
                className={`form-input ${errors.category ? 'error' : ''}`}
              />
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>
            
            <div className="form-group">
              <input 
                type="text" 
                name="plan" 
                placeholder="Plan (platinum/diamond/gold) *" 
                value={formData.plan} 
                onChange={handleChange} 
                className={`form-input ${errors.plan ? 'error' : ''}`}
              />
              {errors.plan && <span className="error-text">{errors.plan}</span>}
            </div>
            
            <div className="form-group">
              <input 
                type="text" 
                name="district" 
                placeholder="District *" 
                value={formData.district} 
                onChange={handleChange} 
                className={`form-input ${errors.district ? 'error' : ''}`}
              />
              {errors.district && <span className="error-text">{errors.district}</span>}
            </div>
            
            <div className="form-group">
              <input 
                type="text" 
                name="city" 
                placeholder="City *" 
                value={formData.city} 
                onChange={handleChange} 
                className={`form-input ${errors.city ? 'error' : ''}`}
              />
              {errors.city && <span className="error-text">{errors.city}</span>}
            </div>
            
            <div className="form-group">
              <input 
                type="text" 
                name="pincode" 
                placeholder="Pincode *" 
                value={formData.pincode} 
                onChange={handleChange} 
                className={`form-input ${errors.pincode ? 'error' : ''}`}
              />
              {errors.pincode && <span className="error-text">{errors.pincode}</span>}
            </div>
          </div>
        )}

        <div className="form-group">
          <input 
            type="text" 
            name="couponCode" 
            placeholder="Coupon Code *" 
            value={formData.couponCode} 
            onChange={handleChange} 
            className={`form-input ${errors.couponCode ? 'error' : ''}`}
          />
          {errors.couponCode && <span className="error-text">{errors.couponCode}</span>}
        </div>

        <div className="form-group">
          <input 
            type="text" 
            name="offerHighlight" 
            placeholder="Offer Highlight *" 
            value={formData.offerHighlight} 
            onChange={handleChange} 
            className={`form-input ${errors.offerHighlight ? 'error' : ''}`}
          />
          {errors.offerHighlight && <span className="error-text">{errors.offerHighlight}</span>}
        </div>

        <div className="form-group">
          <input 
            type="text" 
            name="offerNormal" 
            placeholder="Offer Normal" 
            value={formData.offerNormal} 
            onChange={handleChange} 
            className="form-input"
          />
        </div>

        <div className="form-group">
          <textarea 
            name="description" 
            placeholder="Description" 
            value={formData.description} 
            onChange={handleChange} 
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <textarea 
            name="termsAndCondition" 
            placeholder="Terms & Conditions" 
            value={formData.termsAndCondition} 
            onChange={handleChange} 
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <input 
            type="date" 
            name="expiredDate" 
            value={formData.expiredDate} 
            onChange={handleChange} 
            className={`form-input ${errors.expiredDate ? 'error' : ''}`}
          />
          {errors.expiredDate && <span className="error-text">{errors.expiredDate}</span>}
        </div>

        <div className="form-group">
          <input 
            type="text" 
            name="shareLink" 
            placeholder="Share Link" 
            value={formData.shareLink} 
            onChange={handleChange} 
            className={`form-input ${errors.shareLink ? 'error' : ''}`}
          />
          {errors.shareLink && <span className="error-text">{errors.shareLink}</span>}
        </div>

      <div className="form-group">
  <label>Watermark Image *</label>
  <input 
    type="file" 
    accept="image/*" 
    onChange={handleWatermarkChange} 
    className={`form-file ${errors.watermarkImage ? 'error' : ''}`} 
  />
  {errors.watermarkImage && <span className="error-text">{errors.watermarkImage}</span>}
  {previewWatermark && <img src={previewWatermark} alt="Watermark Preview" className="coupon-preview"/>}
</div>

<div className="form-group">
  <label>Select Coupon *</label>
  <select
    name="selectedCoupon"
    value={formData.selectedCoupon || ""}
    onChange={handleChange}
    className="form-input"
  >
    <option value="">-- Select Coupon --</option>
    {coupons.map(coupon => (
      <option key={coupon._id} value={coupon._id}>
        {coupon.coupon.couponName}
      </option>
    ))}
  </select>
</div>
{formData.selectedCoupon && (
  <div className="coupon-preview-box">
    <img
      src={`http://localhost:4000/${coupons.find(c => c._id === formData.selectedCoupon)?.coupon.image}`}
      alt="Coupon Preview"
      className="coupon-preview"
    />
  </div>
)}



        
        <div className="form-group">
          <label>Coupon Image *</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            className={`form-file ${errors.image ? 'error' : ''}`}
          />
          {errors.image && <span className="error-text">{errors.image}</span>}
          {previewImage && <img src={previewImage} alt="Preview" className="coupon-preview"/>}
        </div>

        <div className="form-group">
          <label>Adds Poster</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handlePosterChange} 
            className={`form-file ${errors.addsPoster ? 'error' : ''}`}
          />
          {errors.addsPoster && <span className="error-text">{errors.addsPoster}</span>}
          {previewPoster && <img src={previewPoster} alt="Preview Poster" className="coupon-preview"/>}
        </div>

        <button 
          type="submit" 
          className={`form-button ${isSubmitting ? 'submitting' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Coupon'}
        </button>
      </form>
    </div>
  );
};

export default CouponForm;