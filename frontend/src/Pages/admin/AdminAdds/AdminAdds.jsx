import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminAdds.css";

const AdminAdds = () => {
  const [ads, setAds] = useState([]);
  const [editingAdId, setEditingAdId] = useState(null);
  const [formData, setFormData] = useState({
    category: "hero",
    hero: {
      title: "",
      description: "",
      buttonName: "",
      buttonUrl: "",
      btnBackgroundColor: "",
      image: null,
      existingImage: ""
    },
    strap: {
      image: null,
      existingImage: ""
    },
    coupon: {
      image: null,
      existingImage: ""
    },
    slider: {
      logoImage: null,
      title: "",
      content: "",
      buttonName: "",
      buttonColor: "",
      buttonUrl: "",
      buttonBackgroundColor: "",
      existingLogoImage: ""
    },
    logo: {    // Add logo state
      image: null,
      existingImage: ""
    },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all ads
  const fetchAds = async () => {
    try {
      const res = await axios.get("https://navi-theni-2.onrender.com/api/ads");
      setAds(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // Validation functions
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const isValidColor = (color) => {
    // Check if it's a valid hex color or named color
    const s = new Option().style;
    s.color = color;
    return s.color !== '';
  };

  const validateForm = () => {
    const newErrors = {};
    const currentCategory = formData.category;

    if (currentCategory === "hero") {
      if (!formData.hero.title.trim()) newErrors.heroTitle = "Title is required";
      if (!formData.hero.description.trim()) newErrors.heroDescription = "Description is required";
      if (!formData.hero.buttonName.trim()) newErrors.heroButtonName = "Button name is required";

      if (!formData.hero.buttonUrl.trim()) {
        newErrors.heroButtonUrl = "Button URL is required";
      } else if (!isValidUrl(formData.hero.buttonUrl)) {
        newErrors.heroButtonUrl = "Please enter a valid URL";
      }

      if (!formData.hero.btnBackgroundColor.trim()) {
        newErrors.heroBtnBackgroundColor = "Button background color is required";
      } else if (!isValidColor(formData.hero.btnBackgroundColor)) {
        newErrors.heroBtnBackgroundColor = "Please enter a valid color";
      }

      if (!formData.hero.existingImage && !formData.hero.image) {
        newErrors.heroImage = "Image is required";
      }
    }

    if (currentCategory === "strap") {
      if (!formData.strap.existingImage && !formData.strap.image) {
        newErrors.strapImage = "Image is required";
      }
    }

    if (currentCategory === "coupon") {
      if (!formData.coupon.existingImage && !formData.coupon.image) {
        newErrors.couponImage = "Image is required";
      }
    }

    if (currentCategory === "logo") {
      if (!formData.logo.existingImage && !formData.logo.image) {
        newErrors.logoImage = "Image is required";
      }
    }

    if (currentCategory === "slider") {
      if (!formData.slider.title.trim()) newErrors.sliderTitle = "Title is required";
      if (!formData.slider.content.trim()) newErrors.sliderContent = "Content is required";
      if (!formData.slider.buttonName.trim()) newErrors.sliderButtonName = "Button name is required";

      if (!formData.slider.buttonUrl.trim()) {
        newErrors.sliderButtonUrl = "Button URL is required";
      } else if (!isValidUrl(formData.slider.buttonUrl)) {
        newErrors.sliderButtonUrl = "Please enter a valid URL";
      }

      if (formData.slider.buttonColor && !isValidColor(formData.slider.buttonColor)) {
        newErrors.sliderButtonColor = "Please enter a valid color";
      }

      if (!formData.slider.buttonBackgroundColor.trim()) {
        newErrors.sliderButtonBackgroundColor = "Button background color is required";
      } else if (!isValidColor(formData.slider.buttonBackgroundColor)) {
        newErrors.sliderButtonBackgroundColor = "Please enter a valid color";
      }

      if (!formData.slider.existingLogoImage && !formData.slider.logoImage) {
        newErrors.sliderLogoImage = "Logo image is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Start editing ad
  const startEdit = (ad) => {
    setEditingAdId(ad._id);
    setFormData({
      category: ad.category,
      hero: ad.hero ? {
        ...ad.hero,
        image: null,
        existingImage: ad.hero.image || ""
      } : {
        title: "",
        description: "",
        buttonName: "",
        buttonUrl: "",
        btnBackgroundColor: "",
        image: null,
        existingImage: ""
      },
      strap: ad.strap ? {
        image: null,
        existingImage: ad.strap.image || ""
      } : {
        image: null,
        existingImage: ""
      },
      coupon: ad.coupon ? {
        image: null,
        existingImage: ad.coupon.image || ""
      } : {
        image: null,
        existingImage: ""
      },
      slider: ad.slider ? {
        ...ad.slider,
        logoImage: null,
        existingLogoImage: ad.slider.logoImage || ""
      } : {
        logoImage: null,
        title: "",
        content: "",
        buttonName: "",
        buttonColor: "",
        buttonUrl: "",
        buttonBackgroundColor: "",
        existingLogoImage: ""
      },
      logo: ad.logo ? { image: null, existingImage: ad.logo.image || "" } : { image: null, existingImage: "" },
    });
    setErrors({});
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingAdId(null);
    setFormData({
      category: "hero",
      hero: {
        title: "",
        description: "",
        buttonName: "",
        buttonUrl: "",
        btnBackgroundColor: "",
        image: null,
        existingImage: ""
      },
      strap: {
        image: null,
        existingImage: ""
      },
      coupon: {
        image: null,
        existingImage: ""
      },
      slider: {
        logoImage: null,
        title: "",
        content: "",
        buttonName: "",
        buttonColor: "",
        buttonUrl: "",
        buttonBackgroundColor: "",
        existingLogoImage: ""
      },
      logo: { image: null, existingImage: "" },
    });
    setErrors({});
  };

  // Input change
  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [name]: value
      }
    }));

    if (errors[`${type}${name.charAt(0).toUpperCase() + name.slice(1)}`]) {
      setErrors({
        ...errors,
        [`${type}${name.charAt(0).toUpperCase() + name.slice(1)}`]: ""
      });
    }
  };

  // File change
  const handleFileChange = (e, type, field) => {
    const file = e.target.files[0];

    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        setErrors({
          ...errors,
          [`${type}${field.charAt(0).toUpperCase() + field.slice(1)}`]:
            "Please select a valid image file (JPEG, PNG, GIF, WEBP)"
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          [`${type}${field.charAt(0).toUpperCase() + field.slice(1)}`]:
            "Image size should be less than 5MB"
        });
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: file
      }
    }));

    if (errors[`${type}${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
      setErrors({
        ...errors,
        [`${type}${field.charAt(0).toUpperCase() + field.slice(1)}`]: ""
      });
    }
  };

  // Submit edited ad
  const submitEdit = async () => {
    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const element = document.querySelector(`[name="${firstError.replace(/([A-Z])/g, '-$1').toLowerCase().substring(4)}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("category", formData.category);

      if (formData.category === "hero") {
        const heroData = { ...formData.hero };
        delete heroData.image;
        delete heroData.existingImage;
        fd.append("hero", JSON.stringify(heroData));
        if (formData.hero.image) {
          fd.append("hero[image]", formData.hero.image);
        }
      }

      if (formData.category === "strap") {
        fd.append("strap", JSON.stringify({}));
        if (formData.strap.image) {
          fd.append("strap[image]", formData.strap.image);
        }
      }

      if (formData.category === "coupon") {
        fd.append("coupon", JSON.stringify({}));
        if (formData.coupon.image) {
          fd.append("coupon[image]", formData.coupon.image);
        }
      }

      if (formData.category === "slider") {
        const sliderData = { ...formData.slider };
        delete sliderData.logoImage;
        delete sliderData.existingLogoImage;
        fd.append("slider", JSON.stringify(sliderData));
        if (formData.slider.logoImage) {
          fd.append("slider[logoImage]", formData.slider.logoImage);
        }
      }

      // Handle logo category
      if (formData.category === "logo") {
        fd.append("logo", JSON.stringify({}));
        if (formData.logo.image) {
          fd.append("logo[image]", formData.logo.image);
        }
      }

      await axios.put(`https://navi-theni-2.onrender.com/api/ads/${editingAdId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Advertisement updated successfully!");
      setEditingAdId(null);
      setErrors({});
      fetchAds();
    } catch (err) {
      console.error("Submit error:", err, formData);
      alert(err.response?.data?.error || "Error updating ad");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete ad
  const deleteAd = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;
    try {
      await axios.delete(`https://navi-theni-2.onrender.com/api/ads/${id}`);
      fetchAds();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-adds-container">
      <h2>Advertisement Management</h2>

      <div className="ads-list">
        {ads.map((ad) => (
          <div key={ad._id} className="ad-item">
            {editingAdId === ad._id ? (
              <div className="edit-form-container">
                <h3>Edit Advertisement</h3>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="hero">Hero</option>
                    <option value="strap">Strap</option>
                    <option value="coupon">Coupon</option>
                    <option value="slider">Slider</option>
                    <option value="logo">Logo</option>
                  </select>
                </div>

                {formData.category === "hero" && (
                  <>
                    <div className="form-group">
                      <label>Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.hero.title}
                        onChange={(e) => handleInputChange(e, "hero")}
                        className={errors.heroTitle ? "error" : ""}
                      />
                      {errors.heroTitle && <span className="error-text">{errors.heroTitle}</span>}
                    </div>
                    <div className="form-group">
                      <label>Description *</label>
                      <input
                        type="text"
                        name="description"
                        value={formData.hero.description}
                        onChange={(e) => handleInputChange(e, "hero")}
                        className={errors.heroDescription ? "error" : ""}
                      />
                      {errors.heroDescription && <span className="error-text">{errors.heroDescription}</span>}
                    </div>
                    <div className="form-group">
                      <label>Button Name *</label>
                      <input
                        type="text"
                        name="buttonName"
                        value={formData.hero.buttonName}
                        onChange={(e) => handleInputChange(e, "hero")}
                        className={errors.heroButtonName ? "error" : ""}
                      />
                      {errors.heroButtonName && <span className="error-text">{errors.heroButtonName}</span>}
                    </div>
                    <div className="form-group">
                      <label>Button URL *</label>
                      <input
                        type="text"
                        name="buttonUrl"
                        value={formData.hero.buttonUrl}
                        onChange={(e) => handleInputChange(e, "hero")}
                        className={errors.heroButtonUrl ? "error" : ""}
                        placeholder="https://example.com"
                      />
                      {errors.heroButtonUrl && <span className="error-text">{errors.heroButtonUrl}</span>}
                    </div>
                    <div className="form-group">
                      <label>Button Background Color *</label>
                      <input
                        type="text"
                        name="btnBackgroundColor"
                        value={formData.hero.btnBackgroundColor}
                        onChange={(e) => handleInputChange(e, "hero")}
                        className={errors.heroBtnBackgroundColor ? "error" : ""}
                        placeholder="#RRGGBB or color name"
                      />
                      {errors.heroBtnBackgroundColor && <span className="error-text">{errors.heroBtnBackgroundColor}</span>}
                    </div>
                    <div className="form-group">
                      <label>Image {!formData.hero.existingImage && "*"}</label>
                      {formData.hero.existingImage && (
                        <div className="image-preview">
                          <p>Current Image:</p>
                          <img
                            src={`https://navi-theni-2.onrender.com/${formData.hero.existingImage}`}
                            alt="Current hero"
                            className="thumb"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, "hero", "image")}
                        className={errors.heroImage ? "error" : ""}
                        accept="image/*"
                      />
                      {errors.heroImage && <span className="error-text">{errors.heroImage}</span>}
                    </div>
                  </>
                )}

                {formData.category === "strap" && (
                  <div className="form-group">
                    <label>Image {!formData.strap.existingImage && "*"}</label>
                    {formData.strap.existingImage && (
                      <div className="image-preview">
                        <p>Current Image:</p>
                        <img
                          src={`https://navi-theni-2.onrender.com/${formData.strap.existingImage}`}
                          alt="Current strap"
                          className="thumb"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "strap", "image")}
                      className={errors.strapImage ? "error" : ""}
                      accept="image/*"
                    />
                    {errors.strapImage && <span className="error-text">{errors.strapImage}</span>}
                  </div>
                )}

                {formData.category === "coupon" && (
                  <div className="form-group">
                    <label>Image {!formData.coupon.existingImage && "*"}</label>
                    {formData.coupon.existingImage && (
                      <div className="image-preview">
                        <p>Current Image:</p>
                        <img
                          src={`https://navi-theni-2.onrender.com/${formData.coupon.existingImage}`}
                          alt="Current coupon"
                          className="thumb"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "coupon", "image")}
                      className={errors.couponImage ? "error" : ""}
                      accept="image/*"
                    />
                    {errors.couponImage && <span className="error-text">{errors.couponImage}</span>}
                  </div>
                )}

                {formData.category === "slider" && (
                  <>
                    <div className="form-group">
                      <label>Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.slider.title}
                        onChange={(e) => handleInputChange(e, "slider")}
                        className={errors.sliderTitle ? "error" : ""}
                      />
                      {errors.sliderTitle && <span className="error-text">{errors.sliderTitle}</span>}
                    </div>
                    <div className="form-group">
                      <label>Content *</label>
                      <input
                        type="text"
                        name="content"
                        value={formData.slider.content}
                        onChange={(e) => handleInputChange(e, "slider")}
                        className={errors.sliderContent ? "error" : ""}
                      />
                      {errors.sliderContent && <span className="error-text">{errors.sliderContent}</span>}
                    </div>
                    <div className="form-group">
                      <label>Button Name *</label>
                      <input
                        type="text"
                        name="buttonName"
                        value={formData.slider.buttonName}
                        onChange={(e) => handleInputChange(e, "slider")}
                        className={errors.sliderButtonName ? "error" : ""}
                      />
                      {errors.sliderButtonName && <span className="error-text">{errors.sliderButtonName}</span>}
                    </div>
                    <div className="form-group">
                      <label>Button Color</label>
                      <input
                        type="text"
                        name="buttonColor"
                        value={formData.slider.buttonColor}
                        onChange={(e) => handleInputChange(e, "slider")}
                        className={errors.sliderButtonColor ? "error" : ""}
                        placeholder="#RRGGBB or color name"
                      />
                      {errors.sliderButtonColor && <span className="error-text">{errors.sliderButtonColor}</span>}
                    </div>
                    <div className="form-group">
                      <label>Button URL *</label>
                      <input
                        type="text"
                        name="buttonUrl"
                        value={formData.slider.buttonUrl}
                        onChange={(e) => handleInputChange(e, "slider")}
                        className={errors.sliderButtonUrl ? "error" : ""}
                        placeholder="https://example.com"
                      />
                      {errors.sliderButtonUrl && <span className="error-text">{errors.sliderButtonUrl}</span>}
                    </div>
                    <div className="form-group">
                      <label>Button Background Color *</label>
                      <input
                        type="text"
                        name="buttonBackgroundColor"
                        value={formData.slider.buttonBackgroundColor}
                        onChange={(e) => handleInputChange(e, "slider")}
                        className={errors.sliderButtonBackgroundColor ? "error" : ""}
                        placeholder="#RRGGBB or color name"
                      />
                      {errors.sliderButtonBackgroundColor && <span className="error-text">{errors.sliderButtonBackgroundColor}</span>}
                    </div>
                    <div className="form-group">
                      <label>Logo Image {!formData.slider.existingLogoImage && "*"}</label>
                      {formData.slider.existingLogoImage && (
                        <div className="image-preview">
                          <p>Current Logo:</p>
                          <img
                            src={`https://navi-theni-2.onrender.com/${formData.slider.existingLogoImage}`}
                            alt="Current slider logo"
                            className="thumb"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, "slider", "logoImage")}
                        className={errors.sliderLogoImage ? "error" : ""}
                        accept="image/*"
                      />
                      {errors.sliderLogoImage && <span className="error-text">{errors.sliderLogoImage}</span>}
                    </div>
                  </>
                )}

                {formData.category === "logo" && (
                  <div className="form-group">
                    <label>Logo Image {!formData.logo.existingImage && "*"}</label>
                    {formData.logo.existingImage && (
                      <div className="image-preview">
                        <p>Current Image:</p>
                        <img
                          src={`https://navi-theni-2.onrender.com/${formData.logo.existingImage}`}
                          alt="Current logo"
                          className="thumb"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "logo", "image")}
                      className={errors.logoImage ? "error" : ""}
                      accept="image/*"
                    />
                    {errors.logoImage && <span className="error-text">{errors.logoImage}</span>}
                  </div>
                )}

                <div className="form-buttons">
                  <button
                    className={`save-btn ${isSubmitting ? "submitting" : ""}`}
                    onClick={submitEdit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                  <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h3>Category: {ad.category.toUpperCase()}</h3>

                {ad.category === "hero" && ad.hero && (
                  <div className="ad-content">
                    {ad.hero.image && (
                      <div className="image-container">
                        <img src={`https://navi-theni-2.onrender.com/${ad.hero.image}`} alt="hero" className="preview-image" />
                      </div>
                    )}
                    <p><strong>Title:</strong> {ad.hero.title}</p>
                    <p><strong>Description:</strong> {ad.hero.description}</p>
                    <p><strong>Button Name:</strong> {ad.hero.buttonName}</p>
                    <p><strong>Button URL:</strong> {ad.hero.buttonUrl}</p>
                    <p><strong>Button Background Color:</strong>
                      <span className="color-box" style={{ backgroundColor: ad.hero.btnBackgroundColor }}></span>
                      {ad.hero.btnBackgroundColor}
                    </p>
                  </div>
                )}

                {ad.category === "strap" && ad.strap?.image && (
                  <div className="ad-content">
                    <div className="image-container">
                      <img src={`https://navi-theni-2.onrender.com/${ad.strap.image}`} alt="strap" className="preview-image" />
                    </div>
                  </div>
                )}

                {ad.category === "coupon" && ad.coupon?.image && (
                  <div className="ad-content">
                    <div className="image-container">
                      <img src={`https://navi-theni-2.onrender.com/${ad.coupon.image}`} alt="coupon" className="preview-image" />
                    </div>
                  </div>
                )}

                {ad.category === "slider" && ad.slider && (
                  <div className="ad-content">
                    {ad.slider.logoImage && (
                      <div className="image-container">
                        <img src={`https://navi-theni-2.onrender.com/${ad.slider.logoImage}`} alt="slider logo" className="preview-image" />
                      </div>
                    )}
                    <p><strong>Title:</strong> {ad.slider.title}</p>
                    <p><strong>Content:</strong> {ad.slider.content}</p>
                    <p><strong>Button Name:</strong> {ad.slider.buttonName}</p>
                    <p><strong>Button URL:</strong> {ad.slider.buttonUrl}</p>
                    <p><strong>Button Color:</strong>
                      <span className="color-box" style={{ color: ad.slider.buttonColor }}>Text</span>
                      {ad.slider.buttonColor}
                    </p>
                    <p><strong>Button Background Color:</strong>
                      <span className="color-box" style={{ backgroundColor: ad.slider.buttonBackgroundColor }}></span>
                      {ad.slider.buttonBackgroundColor}
                    </p>
                  </div>
                )}

                {ad.category === "logo" && ad.logo?.image && (
                  <div className="ad-content">
                    <div className="image-container">
                      <img src={`https://navi-theni-2.onrender.com/${ad.logo.image}`} alt="logo" className="preview-image" />
                    </div>
                  </div>
                )}

                <div className="ad-meta">
                  <p><strong>Created At:</strong> {new Date(ad.createdAt).toLocaleString()}</p>
                  <p><strong>Updated At:</strong> {new Date(ad.updatedAt).toLocaleString()}</p>
                </div>

                <div className="ad-actions">
                  <button className="edit-btn" onClick={() => startEdit(ad)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteAd(ad._id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAdds;
