import React, { useState, useMemo } from "react";
import axios from "axios";
import "./AddStore.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddStore = () => {
  const [formData, setFormData] = useState({
    storeName: "",
    category: "",
    description: "",
    plan: "",
    review: "",
    location: { city: "", district: "", pincode: "", maplink: "" },
    aboutMe: "",
    phoneNumber: "",
    websiteLink: "",
    socialMediaLinks: {
      instagram: "",
      facebook: "",
      twitter: "",
      youtube: "",
      email: "",
    },
    services: [{ title: "", description: "", image: null }],
    products: [{ title: "", description: "", image: null }],
  });

  const [files, setFiles] = useState({
    coverImage: null,
    logoImage: null,
    galleryImages: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation rules
  const validateForm = () => {
    const newErrors = {};

    // Store name validation
    if (!formData.storeName.trim()) {
      newErrors.storeName = "Store name is required";
    } else if (formData.storeName.length < 3) {
      newErrors.storeName = "Store name must be at least 3 characters";
    }

    // Category validation
    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    // Location validation
    if (!formData.location.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.location.district.trim()) {
      newErrors.district = "District is required";
    }
    if (!formData.location.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.location.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber.replace(/\D/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    // Website validation
    if (formData.websiteLink && !/^https?:\/\/.+\..+/.test(formData.websiteLink)) {
      newErrors.websiteLink = "Please enter a valid website URL";
    }

    // Email validation
    if (formData.socialMediaLinks.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.socialMediaLinks.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Cover image validation
    if (!files.coverImage) {
      newErrors.coverImage = "Cover image is required";
    }

    // Logo image validation
    if (!files.logoImage) {
      newErrors.logoImage = "Logo image is required";
    }

    // Services validation
    formData.services.forEach((service, index) => {
      if (!service.title.trim()) {
        newErrors[`serviceTitle_${index}`] = "Service title is required";
      }
      if (!service.description.trim()) {
        newErrors[`serviceDesc_${index}`] = "Service description is required";
      }
      if (!service.image) {
        newErrors[`serviceImage_${index}`] = "Service image is required";
      }
    });

    // Products validation
    formData.products.forEach((product, index) => {
      if (!product.title.trim()) {
        newErrors[`productTitle_${index}`] = "Product title is required";
      }
      if (!product.description.trim()) {
        newErrors[`productDesc_${index}`] = "Product description is required";
      }
      if (!product.image) {
        newErrors[`productImage_${index}`] = "Product image is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle text inputs (supports nested objects like location.city)
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Handle gallery/cover/logo images
  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;

    // Clear error when user selects a file
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (e.target.multiple) {
      setFiles((prev) => ({
        ...prev,
        [name]: [...prev[name], ...Array.from(selectedFiles)],
      }));
    } else {
      setFiles((prev) => ({
        ...prev,
        [name]: selectedFiles[0],
      }));
    }
  };

  // ✅ Handle service change
  const handleServiceChange = (index, field, value) => {
    const updated = [...formData.services];
    updated[index][field] = value;
    setFormData({ ...formData, services: updated });

    // Clear error when user starts typing
    const errorKey = `service${field.charAt(0).toUpperCase() + field.slice(1)}_${index}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // ✅ Handle product change
  const handleProductChange = (index, field, value) => {
    const updated = [...formData.products];
    updated[index][field] = value;
    setFormData({ ...formData, products: updated });

    // Clear error when user starts typing
    const errorKey = `product${field.charAt(0).toUpperCase() + field.slice(1)}_${index}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  // ✅ Add new service/product
  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { title: "", description: "", image: null }],
    }));
  };

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { title: "", description: "", image: null }],
    }));
  };

  // Remove service/product
  const removeService = (index) => {
    if (formData.services.length <= 1) return;
    const updated = [...formData.services];
    updated.splice(index, 1);
    setFormData({ ...formData, services: updated });
  };

  const removeProduct = (index) => {
    if (formData.products.length <= 1) return;
    const updated = [...formData.products];
    updated.splice(index, 1);
    setFormData({ ...formData, products: updated });
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();

      // basic fields
      data.append("storeName", formData.storeName);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("plan", formData.plan);
      data.append("review", formData.review);
      data.append("aboutMe", formData.aboutMe);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("websiteLink", formData.websiteLink);
      data.append("location", JSON.stringify(formData.location));
      data.append("socialMediaLinks", JSON.stringify(formData.socialMediaLinks));

      // nested objects
      Object.keys(formData.location).forEach((key) =>
        data.append(`location[${key}]`, formData.location[key])
      );
      Object.keys(formData.socialMediaLinks).forEach((key) =>
        data.append(`socialMediaLinks[${key}]`, formData.socialMediaLinks[key])
      );

      // stringify services/products (without images)
      const servicesNoImg = formData.services.map((s) => ({
        title: s.title,
        description: s.description,
      }));
      const productsNoImg = formData.products.map((p) => ({
        title: p.title,
        description: p.description,
      }));

      data.append("services", JSON.stringify(servicesNoImg));
      data.append("products", JSON.stringify(productsNoImg));

      // attach files
      if (files.coverImage) data.append("coverImage", files.coverImage);
      if (files.logoImage) data.append("logoImage", files.logoImage);

      files.galleryImages?.forEach((file) =>
        data.append("galleryImages", file)
      );

      formData.services.forEach((service) => {
        if (service.image) {
          data.append("serviceImages", service.image);
        }
      });

      formData.products.forEach((product) => {
        if (product.image) {
          data.append("productImages", product.image);
        }
      });

      await axios.post("https://navi-theni-2.onrender.com/api/stores", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Store Added Successfully ✅");
      // Reset form after successful submission
      setFormData({
        storeName: "",
        category: "",
        description: "",
        plan: "",
        review: "",
        location: { city: "", district: "", pincode: "", maplink: "" },
        aboutMe: "",
        phoneNumber: "",
        websiteLink: "",
        socialMediaLinks: {
          instagram: "",
          facebook: "",
          twitter: "",
          youtube: "",
          email: "",
        },
        services: [{ title: "", description: "", image: null }],
        products: [{ title: "", description: "", image: null }],
      });
      setFiles({
        coverImage: null,
        logoImage: null,
        galleryImages: [],
      });
      setErrors({});
    } catch (err) {
      console.error("Error adding store:", err);
      alert("Failed to add store ❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');

    // Apply formatting based on length
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
  };

  // Handle phone number input with formatting
  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phoneNumber: formatted });

    if (errors.phoneNumber) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phoneNumber;
        return newErrors;
      });
    }
  };

  return (
    <div className="add-store-page">
      <h2>Add New Store</h2>
      <form className="store-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Basic Information</h3>

          <div className="form-group">
            <label>Store Name *</label>
            <input
              type="text"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              className={errors.storeName ? "error" : ""}
              required
            />
            {errors.storeName && <span className="error-text">{errors.storeName}</span>}
          </div>

          <div className="form-group">
            <label>Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? "error" : ""}
              placeholder="Enter category"
            />
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "error" : ""}
              rows="4"
            ></textarea>
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label>Plan *</label>
            <select
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              className={errors.plan ? "error" : ""}
            >
              <option value="">Select a plan</option>
              <option value="platinum">Platinum</option>
              <option value="diamond">Diamond</option>
              <option value="gold">Gold</option>
            </select>
            {errors.plan && <span className="error-text">{errors.plan}</span>}
          </div>


          <div className="form-group">
            <label>Review</label>
            <input
              type="text"
              name="review"
              value={formData.review}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Images</h3>

          <div className="form-group">
            <label>Cover Image *</label>
            <input
              type="file"
              name="coverImage"
              onChange={handleFileChange}
              className={errors.coverImage ? "error" : ""}
            />
            {errors.coverImage && <span className="error-text">{errors.coverImage}</span>}
            {files.coverImage && (
              <div className="preview-box">
                <img
                  src={URL.createObjectURL(files.coverImage)}
                  alt="Cover preview"
                  className="preview-img"
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Logo Image *</label>
            <input
              type="file"
              name="logoImage"
              onChange={handleFileChange}
              className={errors.logoImage ? "error" : ""}
            />
            {errors.logoImage && <span className="error-text">{errors.logoImage}</span>}
            {files.logoImage && (
              <div className="preview-box">
                <img
                  src={URL.createObjectURL(files.logoImage)}
                  alt="Logo preview"
                  className="preview-img"
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Gallery Images (upload multiple)</label>
            <input
              type="file"
              name="galleryImages"
              multiple
              onChange={handleFileChange}
            />
            {/* ✅ Show previews */}
            <div className="preview-box">
              {files.galleryImages.length > 0 &&
                files.galleryImages.map((img, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="preview-img"
                  />
                ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Location</h3>

          <div className="form-group">
            <label>City *</label>
            <input
              type="text"
              name="location.city"
              placeholder="City"
              value={formData.location.city}
              onChange={handleChange}
              className={errors.city ? "error" : ""}
            />
            {errors.city && <span className="error-text">{errors.city}</span>}
          </div>

          <div className="form-group">
            <label>District *</label>
            <input
              type="text"
              name="location.district"
              placeholder="District"
              value={formData.location.district}
              onChange={handleChange}
              className={errors.district ? "error" : ""}
            />
            {errors.district && <span className="error-text">{errors.district}</span>}
          </div>

          <div className="form-group">
            <label>Pincode *</label>
            <input
              type="text"
              name="location.pincode"
              placeholder="Pincode"
              value={formData.location.pincode}
              onChange={handleChange}
              className={errors.pincode ? "error" : ""}
              maxLength="6"
            />
            {errors.pincode && <span className="error-text">{errors.pincode}</span>}
          </div>

          <div className="form-group">
            <label>Map Link</label>
            <input
              type="text"
              name="location.maplink"
              placeholder="Map Link"
              value={formData.location.maplink}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Contact Information</h3>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              className={errors.phoneNumber ? "error" : ""}
              placeholder="(123) 456-7890"
              maxLength="14"
            />
            {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
          </div>

          <div className="form-group">
            <label>Website</label>
            <input
              type="text"
              name="websiteLink"
              value={formData.websiteLink}
              onChange={handleChange}
              className={errors.websiteLink ? "error" : ""}
              placeholder="https://example.com"
            />
            {errors.websiteLink && <span className="error-text">{errors.websiteLink}</span>}
          </div>

          <div className="form-group">
            <label>About Me</label>
            <textarea
              name="aboutMe"
              value={formData.aboutMe}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>
        </div>

        <div className="form-section">
          <h3>Social Media Links</h3>

          <div className="form-group">
            <label>Instagram</label>
            <input
              type="text"
              name="socialMediaLinks.instagram"
              placeholder="Instagram"
              value={formData.socialMediaLinks.instagram}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Facebook</label>
            <input
              type="text"
              name="socialMediaLinks.facebook"
              placeholder="Facebook"
              value={formData.socialMediaLinks.facebook}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Twitter</label>
            <input
              type="text"
              name="socialMediaLinks.twitter"
              placeholder="Twitter"
              value={formData.socialMediaLinks.twitter}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>YouTube</label>
            <input
              type="text"
              name="socialMediaLinks.youtube"
              placeholder="YouTube"
              value={formData.socialMediaLinks.youtube}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="socialMediaLinks.email"
              placeholder="Email"
              value={formData.socialMediaLinks.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Services *</h3>
          {formData.services.map((service, index) => (
            <div key={index} className="service-block block-item">
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeService(index)}
                disabled={formData.services.length <= 1}
              >
                ×
              </button>

              <div className="form-group">
                <label>Service Title</label>
                <input
                  type="text"
                  placeholder="Service Title"
                  value={service.title}
                  onChange={(e) =>
                    handleServiceChange(index, "title", e.target.value)
                  }
                  className={errors[`serviceTitle_${index}`] ? "error" : ""}
                />
                {errors[`serviceTitle_${index}`] && <span className="error-text">{errors[`serviceTitle_${index}`]}</span>}
              </div>

              <div className="form-group">
                <label>Service Description</label>
                <textarea
                  placeholder="Service Description"
                  value={service.description}
                  onChange={(e) =>
                    handleServiceChange(index, "description", e.target.value)
                  }
                  className={errors[`serviceDesc_${index}`] ? "error" : ""}
                  rows="3"
                ></textarea>
                {errors[`serviceDesc_${index}`] && <span className="error-text">{errors[`serviceDesc_${index}`]}</span>}
              </div>

              <div className="form-group">
                <label>Service Image</label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    const updated = [...formData.services];
                    updated[index].image = file;
                    setFormData({ ...formData, services: updated });

                    // Clear error when user selects a file
                    if (errors[`serviceImage_${index}`]) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors[`serviceImage_${index}`];
                        return newErrors;
                      });
                    }
                  }}
                  className={errors[`serviceImage_${index}`] ? "error" : ""}
                />
                {errors[`serviceImage_${index}`] && <span className="error-text">{errors[`serviceImage_${index}`]}</span>}
                {service.image && (
                  <div className="preview-box">
                    <img
                      src={URL.createObjectURL(service.image)}
                      alt="Service preview"
                      className="preview-img"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          <button type="button" onClick={addService} className="add-btn">
            + Add Another Service
          </button>
        </div>

        <div className="form-section">
          <h3>Products *</h3>
          {formData.products.map((product, index) => (
            <div key={index} className="product-block block-item">
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeProduct(index)}
                disabled={formData.products.length <= 1}
              >
                ×
              </button>

              <div className="form-group">
                <label>Product Title</label>
                <input
                  type="text"
                  placeholder="Product Title"
                  value={product.title}
                  onChange={(e) =>
                    handleProductChange(index, "title", e.target.value)
                  }
                  className={errors[`productTitle_${index}`] ? "error" : ""}
                />
                {errors[`productTitle_${index}`] && <span className="error-text">{errors[`productTitle_${index}`]}</span>}
              </div>

              <div className="form-group">
                <label>Product Description</label>
                <textarea
                  placeholder="Product Description"
                  value={product.description}
                  onChange={(e) =>
                    handleProductChange(index, "description", e.target.value)
                  }
                  className={errors[`productDesc_${index}`] ? "error" : ""}
                  rows="3"
                ></textarea>
                {errors[`productDesc_${index}`] && <span className="error-text">{errors[`productDesc_${index}`]}</span>}
              </div>

              <div className="form-group">
                <label>Product Image</label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    const updated = [...formData.products];
                    updated[index].image = file;
                    setFormData({ ...formData, products: updated });

                    // Clear error when user selects a file
                    if (errors[`productImage_${index}`]) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors[`productImage_${index}`];
                        return newErrors;
                      });
                    }
                  }}
                  className={errors[`productImage_${index}`] ? "error" : ""}
                />
                {errors[`productImage_${index}`] && <span className="error-text">{errors[`productImage_${index}`]}</span>}
                {product.image && (
                  <div className="preview-box">
                    <img
                      src={URL.createObjectURL(product.image)}
                      alt="Product preview"
                      className="preview-img"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          <button type="button" onClick={addProduct} className="add-btn">
            + Add Another Product
          </button>
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding Store..." : "Add Store"}
        </button>
      </form>
    </div>
  );
};

export default AddStore;