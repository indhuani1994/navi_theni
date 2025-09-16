import React, { useState } from "react";
import axios from "axios";
import "./Addad.css";

const AddAd = ({ refreshAds }) => {
  const [category, setCategory] = useState("hero");
  const [hero, setHero] = useState({
    image: null,
    title: "",
    description: "",
    buttonName: "",
    buttonUrl: "",
    btnBackgroundColor: ""
  });
  const [strap, setStrap] = useState({ image: null });
  const [coupon, setCoupon] = useState({ couponName: "", image: null });
  const [slider, setSlider] = useState({
    logoImage: null,
    title: "",
    content: "",
    buttonName: "",
    buttonColor: "",
    buttonUrl: "",
    buttonBackgroundColor: ""
  });
  const [logo, setLogo] = useState({ image: null }); // Added logo state

  // Validation states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (category === "hero") {
      if (!hero.title.trim()) newErrors.heroTitle = "Title is required";
      if (!hero.description.trim()) newErrors.heroDescription = "Description is required";
      if (!hero.buttonName.trim()) newErrors.heroButtonName = "Button name is required";
      if (!hero.buttonUrl.trim()) newErrors.heroButtonUrl = "Button URL is required";
      else if (!isValidUrl(hero.buttonUrl)) newErrors.heroButtonUrl = "Please enter a valid URL";
      if (!hero.btnBackgroundColor.trim()) newErrors.heroBtnBackgroundColor = "Button background color is required";
      if (!hero.image) newErrors.heroImage = "Image is required";
    }

    if (category === "strap") {
      if (!strap.image) newErrors.strapImage = "Image is required";
    }

    if (category === "coupon") {
      if (!coupon.couponName.trim()) newErrors.couponName = "Coupon name is required";
      if (!coupon.image) newErrors.couponImage = "Image is required";
    }

    if (category === "slider") {
      if (!slider.title.trim()) newErrors.sliderTitle = "Title is required";
      if (!slider.content.trim()) newErrors.sliderContent = "Content is required";
      if (!slider.buttonName.trim()) newErrors.sliderButtonName = "Button name is required";
      if (!slider.buttonUrl.trim()) newErrors.sliderButtonUrl = "Button URL is required";
      else if (!isValidUrl(slider.buttonUrl)) newErrors.sliderButtonUrl = "Please enter a valid URL";
      if (!slider.buttonBackgroundColor.trim()) newErrors.sliderButtonBackgroundColor = "Button background color is required";
      if (!slider.logoImage) newErrors.sliderLogoImage = "Logo image is required";
    }

    if (category === "logo") {  // Validation for logo category
      if (!logo.image) newErrors.logoImage = "Image is required";
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

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "hero") setHero((prev) => ({ ...prev, [name]: value }));
    if (type === "strap") setStrap((prev) => ({ ...prev, [name]: value }));
    if (type === "coupon") setCoupon((prev) => ({ ...prev, [name]: value }));
    if (type === "slider") setSlider((prev) => ({ ...prev, [name]: value }));
    if (type === "logo") setLogo((prev) => ({ ...prev, [name]: value }));

    const camelKey = `${type}${name.charAt(0).toUpperCase() + name.slice(1)}`; 
    if (errors[camelKey]) {
      setErrors((prev) => ({ ...prev, [camelKey]: "" }));
    } else if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e, type, field) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validImageTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, [`${type}Image`]: "Please select a valid image file (JPEG, PNG, GIF, WEBP)" }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [`${type}Image`]: "Image size should be less than 5MB" }));
      return;
    }

    if (type === "hero") {
      setHero((prev) => ({ ...prev, [field]: file }));
      setErrors((prev) => ({ ...prev, heroImage: "" }));
    } else if (type === "strap") {
      setStrap((prev) => ({ ...prev, [field]: file }));
      setErrors((prev) => ({ ...prev, strapImage: "" }));
    } else if (type === "coupon") {
      setCoupon((prev) => ({ ...prev, [field]: file }));
      setErrors((prev) => ({ ...prev, couponImage: "" }));
    } else if (type === "slider") {
      setSlider((prev) => ({ ...prev, [field]: file }));
      setErrors((prev) => ({ ...prev, sliderLogoImage: "" }));
    } else if (type === "logo") {  // Handle logo file input
      setLogo((prev) => ({ ...prev, [field]: file }));
      setErrors((prev) => ({ ...prev, logoImage: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const el = document.querySelector(`[name="${firstErrorKey.replace(/^[a-z]+/, (m) => m)}"]`) || document.querySelector("input, select, textarea");
        el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("category", category);

    if (category === "hero") {
      formData.append(
        "hero",
        JSON.stringify({
          title: hero.title,
          description: hero.description,
          buttonName: hero.buttonName,
          buttonUrl: hero.buttonUrl,
          btnBackgroundColor: hero.btnBackgroundColor
        })
      );
      if (hero.image) formData.append("hero[image]", hero.image);
    }

    if (category === "strap" && strap.image) {
      formData.append("strap[image]", strap.image);
    }

    if (category === "coupon") {
      formData.append(
        "coupon",
        JSON.stringify({
          couponName: coupon.couponName
        })
      );
      if (coupon.image) formData.append("coupon[image]", coupon.image);
    }

    if (category === "slider") {
      formData.append(
        "slider",
        JSON.stringify({
          title: slider.title,
          content: slider.content,
          buttonName: slider.buttonName,
          buttonColor: slider.buttonColor,
          buttonUrl: slider.buttonUrl,
          buttonBackgroundColor: slider.buttonBackgroundColor
        })
      );
      if (slider.logoImage) formData.append("slider[logoImage]", slider.logoImage);
    }

    if (category === "logo") {  // Append logo image to form submission
      formData.append("logo", JSON.stringify({}));
      if (logo.image) formData.append("logo[image]", logo.image);
    }

    try {
      await axios.post("http://localhost:4000/api/ads", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Advertisement added successfully!");
      refreshAds();

      setHero({ image: null, title: "", description: "", buttonName: "", buttonUrl: "", btnBackgroundColor: "" });
      setStrap({ image: null });
      setCoupon({ couponName: "", image: null });
      setSlider({ logoImage: null, title: "", content: "", buttonName: "", buttonColor: "", buttonUrl: "", buttonBackgroundColor: "" });
      setLogo({ image: null }); // Reset logo state
      setErrors({});
    } catch (err) {
      alert(err.response?.data?.message || "Error adding advertisement");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ad-form">
      <h2>Add New Advertisement</h2>

      <div className="form-group">
        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="hero">Hero</option>
          <option value="strap">Strap</option>
          <option value="coupon">Coupon</option>
          <option value="slider">Slider</option>
          <option value="logo">Logo</option> {/* Added logo category option */}
        </select>
      </div>

      {category === "hero" && (
        <div className="category-section">
          <h3>Hero Advertisement</h3>
          <div className="form-group">
            <input
              type="text"
              name="title"
              placeholder="Title *"
              value={hero.title}
              onChange={(e) => handleChange(e, "hero")}
              className={errors.heroTitle ? "error" : ""}
            />
            {errors.heroTitle && <span className="error-text">{errors.heroTitle}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="description"
              placeholder="Description *"
              value={hero.description}
              onChange={(e) => handleChange(e, "hero")}
              className={errors.heroDescription ? "error" : ""}
            />
            {errors.heroDescription && <span className="error-text">{errors.heroDescription}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="buttonName"
              placeholder="Button Name *"
              value={hero.buttonName}
              onChange={(e) => handleChange(e, "hero")}
              className={errors.heroButtonName ? "error" : ""}
            />
            {errors.heroButtonName && <span className="error-text">{errors.heroButtonName}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="buttonUrl"
              placeholder="Button URL *"
              value={hero.buttonUrl}
              onChange={(e) => handleChange(e, "hero")}
              className={errors.heroButtonUrl ? "error" : ""}
            />
            {errors.heroButtonUrl && <span className="error-text">{errors.heroButtonUrl}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="btnBackgroundColor"
              placeholder="Button Background Color *"
              value={hero.btnBackgroundColor}
              onChange={(e) => handleChange(e, "hero")}
              className={errors.heroBtnBackgroundColor ? "error" : ""}
            />
            {errors.heroBtnBackgroundColor && <span className="error-text">{errors.heroBtnBackgroundColor}</span>}
          </div>

          <div className="form-group">
            <label>Image *</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "hero", "image")}
              className={errors.heroImage ? "error" : ""}
              accept="image/*"
            />
            {errors.heroImage && <span className="error-text">{errors.heroImage}</span>}
            {hero.image && <span className="file-name">{hero.image.name}</span>}
          </div>
        </div>
      )}

      {category === "strap" && (
        <div className="category-section">
          <h3>Strap Advertisement</h3>
          <div className="form-group">
            <label>Image *</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "strap", "image")}
              className={errors.strapImage ? "error" : ""}
              accept="image/*"
            />
            {errors.strapImage && <span className="error-text">{errors.strapImage}</span>}
            {strap.image && <span className="file-name">{strap.image.name}</span>}
          </div>
        </div>
      )}

      {category === "coupon" && (
        <div className="category-section">
          <h3>Coupon Advertisement</h3>

          <div className="form-group">
            <input
              type="text"
              name="couponName"
              placeholder="Coupon Name *"
              value={coupon.couponName}
              onChange={(e) => handleChange(e, "coupon")}
              className={errors.couponName ? "error" : ""}
            />
            {errors.couponName && <span className="error-text">{errors.couponName}</span>}
          </div>

          <div className="form-group">
            <label>Image *</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "coupon", "image")}
              className={errors.couponImage ? "error" : ""}
              accept="image/*"
            />
            {errors.couponImage && <span className="error-text">{errors.couponImage}</span>}
            {coupon.image && <span className="file-name">{coupon.image.name}</span>}
          </div>
        </div>
      )}

      {category === "slider" && (
        <div className="category-section">
          <h3>Slider Advertisement</h3>

          <div className="form-group">
            <input
              type="text"
              name="title"
              placeholder="Title *"
              value={slider.title}
              onChange={(e) => handleChange(e, "slider")}
              className={errors.sliderTitle ? "error" : ""}
            />
            {errors.sliderTitle && <span className="error-text">{errors.sliderTitle}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="content"
              placeholder="Content *"
              value={slider.content}
              onChange={(e) => handleChange(e, "slider")}
              className={errors.sliderContent ? "error" : ""}
            />
            {errors.sliderContent && <span className="error-text">{errors.sliderContent}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="buttonName"
              placeholder="Button Name *"
              value={slider.buttonName}
              onChange={(e) => handleChange(e, "slider")}
              className={errors.sliderButtonName ? "error" : ""}
            />
            {errors.sliderButtonName && <span className="error-text">{errors.sliderButtonName}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="buttonColor"
              placeholder="Button Color"
              value={slider.buttonColor}
              onChange={(e) => handleChange(e, "slider")}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="buttonUrl"
              placeholder="Button URL *"
              value={slider.buttonUrl}
              onChange={(e) => handleChange(e, "slider")}
              className={errors.sliderButtonUrl ? "error" : ""}
            />
            {errors.sliderButtonUrl && <span className="error-text">{errors.sliderButtonUrl}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="buttonBackgroundColor"
              placeholder="Button Background Color *"
              value={slider.buttonBackgroundColor}
              onChange={(e) => handleChange(e, "slider")}
              className={errors.sliderButtonBackgroundColor ? "error" : ""}
            />
            {errors.sliderButtonBackgroundColor && <span className="error-text">{errors.sliderButtonBackgroundColor}</span>}
          </div>

          <div className="form-group">
            <label>Logo Image *</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "slider", "logoImage")}
              className={errors.sliderLogoImage ? "error" : ""}
              accept="image/*"
            />
            {errors.sliderLogoImage && <span className="error-text">{errors.sliderLogoImage}</span>}
            {slider.logoImage && <span className="file-name">{slider.logoImage.name}</span>}
          </div>
        </div>
      )}

      {category === "logo" && (
        <div className="category-section">
          <h3>Logo Advertisement</h3>
          <div className="form-group">
            <label>Image *</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, "logo", "image")}
              className={errors.logoImage ? "error" : ""}
              accept="image/*"
            />
            {errors.logoImage && <span className="error-text">{errors.logoImage}</span>}
            {logo.image && <span className="file-name">{logo.image.name}</span>}
          </div>
        </div>
      )}

      <button type="submit" className={`submit-btn ${isSubmitting ? "submitting" : ""}`} disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Advertisement"}
      </button>
    </form>
  );
};

export default AddAd;
