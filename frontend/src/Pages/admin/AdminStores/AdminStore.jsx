import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminStore.css";

const AdminStore = () => {
  const [stores, setStores] = useState([]);
  const [editingStoreId, setEditingStoreId] = useState(null);
  const [viewingStoreId, setViewingStoreId] = useState(null);
  const [editData, setEditData] = useState({});
  const [viewData, setViewData] = useState({});
  const [coverFile, setCoverFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [serviceFiles, setServiceFiles] = useState({});
  const [productFiles, setProductFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("https://navi-theni-2.onrender.com/api/stores");
      setStores(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching stores:", err);
      alert("❌ Failed to fetch stores");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!editData.storeName || editData.storeName.trim() === '') {
      newErrors.storeName = "Store name is required";
    }
    
    if (!editData.category || editData.category.trim() === '') {
      newErrors.category = "Category is required";
    }
    
    if (!editData.phoneNumber || editData.phoneNumber.trim() === '') {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(editData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }
    
    if (editData.location) {
      if (!editData.location.district || editData.location.district.trim() === '') {
        newErrors.district = "District is required";
      }
      
      if (!editData.location.city || editData.location.city.trim() === '') {
        newErrors.city = "City is required";
      }
      
      if (!editData.location.pincode || editData.location.pincode.trim() === '') {
        newErrors.pincode = "Pincode is required";
      } else if (!/^\d{6}$/.test(editData.location.pincode)) {
        newErrors.pincode = "Pincode must be 6 digits";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEdit = (store) => {
    setEditingStoreId(store._id);
    setEditData({
      ...store,
      location: store.location || { city: "", district: "", pincode: "", maplink: "" },
      socialMediaLinks: store.socialMediaLinks || {
        instagram: "",
        facebook: "",
        twitter: "",
        youtube: "",
        email: "",
      },
      services: store.services || [],
      products: store.products || [],
      galleryImages: store.galleryImages || [],
    });
    setServiceFiles({});
    setProductFiles({});
    setErrors({});
  };

  const handleViewMore = (store) => {
    setViewingStoreId(store._id);
    setViewData({
      ...store,
      location: store.location || { city: "", district: "", pincode: "", maplink: "" },
      socialMediaLinks: store.socialMediaLinks || {
        instagram: "",
        facebook: "",
        twitter: "",
        youtube: "",
        email: "",
      },
      services: store.services || [],
      products: store.products || [],
      galleryImages: store.galleryImages || [],
    });
  };

  const cancelEdit = () => {
    setEditingStoreId(null);
    setEditData({});
    setCoverFile(null);
    setLogoFile(null);
    setGalleryFiles([]);
    setServiceFiles({});
    setProductFiles({});
    setErrors({});
  };

  const closeViewModal = () => {
    setViewingStoreId(null);
    setViewData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setEditData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setEditData({ ...editData, [name]: value });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleArrayChange = (e, index, field, type) => {
    const updatedArray = [...editData[type]];
    updatedArray[index][field] = e.target.value;
    setEditData({ ...editData, [type]: updatedArray });
  };

  const addNewField = (type) => {
    const newField = type === "services" || type === "products" 
      ? { title: "", description: "", image: "" } 
      : "";
    setEditData((prev) => ({
      ...prev,
      [type]: [...prev[type], newField],
    }));
  };

  const removeField = async (index, type) => {
  const updatedArray = [...editData[type]];
  const item = updatedArray[index];
  
  // If it's an existing item with an image, delete from backend first
  if (item && item.image && editingStoreId) {
    try {
      if (type === "services") {
        await axios.delete(`https://navi-theni-2.onrender.com/api/stores/${editingStoreId}/services/${index}`);
      } else if (type === "products") {
        await axios.delete(`https://navi-theni-2.onrender.com/api/stores/${editingStoreId}/products/${index}`);
      }
    } catch (err) {
      console.error(`Error deleting ${type.slice(0, -1)}:`, err);
      alert(`❌ Failed to delete ${type.slice(0, -1)}`);
      return; // Don't proceed with removal if backend deletion fails
    }
  }
  
  // Remove from UI
  updatedArray.splice(index, 1);
  setEditData({ ...editData, [type]: updatedArray });
  
  // Also remove any associated file from state
  if (type === "services") {
    setServiceFiles(prev => {
      const newFiles = {...prev};
      delete newFiles[index];
      // Reindex the remaining files
      const reindexed = {};
      Object.keys(newFiles).forEach((key, i) => {
        reindexed[i] = newFiles[key];
      });
      return reindexed;
    });
  } else if (type === "products") {
    setProductFiles(prev => {
      const newFiles = {...prev};
      delete newFiles[index];
      // Reindex the remaining files
      const reindexed = {};
      Object.keys(newFiles).forEach((key, i) => {
        reindexed[i] = newFiles[key];
      });
      return reindexed;
    });
  }
};

  const handleFileChange = (e, index, type) => {
    const files = e.target.files;
    if (type === "services") {
      setServiceFiles((prev) => ({ ...prev, [index]: files[0] }));
    } else if (type === "products") {
      setProductFiles((prev) => ({ ...prev, [index]: files[0] }));
    }
  };


  // Add these functions to your AdminStore component

const deleteService = async (storeId, serviceIndex) => {
  if (window.confirm("Are you sure you want to delete this service?")) {
    try {
      await axios.delete(`https://navi-theni-2.onrender.com/api/stores/${storeId}/services/${serviceIndex}`);
      alert("✅ Service deleted successfully!");
      fetchStores(); // Refresh the stores list
      
      // If we're currently editing this store, update the editData
      if (editingStoreId === storeId) {
        setEditData(prev => ({
          ...prev,
          services: prev.services.filter((_, index) => index !== serviceIndex)
        }));
      }
    } catch (err) {
      console.error("Error deleting service:", err);
      alert("❌ Failed to delete service");
    }
  }
};

const deleteProduct = async (storeId, productIndex) => {
  if (window.confirm("Are you sure you want to delete this product?")) {
    try {
      await axios.delete(`https://navi-theni-2.onrender.com/api/stores/${storeId}/products/${productIndex}`);
      alert("✅ Product deleted successfully!");
      fetchStores(); // Refresh the stores list
      
      // If we're currently editing this store, update the editData
      if (editingStoreId === storeId) {
        setEditData(prev => ({
          ...prev,
          products: prev.products.filter((_, index) => index !== productIndex)
        }));
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("❌ Failed to delete product");
    }
  }
};

const handleUpdate = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    const data = new FormData();
    
    // Create a deep copy of editData
    const updatedData = JSON.parse(JSON.stringify(editData));

    // Handle services
    if (updatedData.services) {
      updatedData.services = updatedData.services.map((service, index) => {
        // If we have a new file, mark the image as empty (will be replaced)
        if (serviceFiles[index]) {
          return { 
            _id: service._id, // Preserve the ID if it exists
            title: service.title, 
            description: service.description, 
            image: "" 
          };
        }
        // Otherwise keep the existing image
        return service;
      });
    }

    // Handle products
    if (updatedData.products) {
      updatedData.products = updatedData.products.map((product, index) => {
        if (productFiles[index]) {
          return { 
            _id: product._id, // Preserve the ID if it exists
            title: product.title, 
            description: product.description, 
            image: "" 
          };
        }
        return product;
      });
    }

    // Append all data fields
    Object.keys(updatedData).forEach((key) => {
      if (["services", "products", "location", "socialMediaLinks"].includes(key)) {
        data.append(key, JSON.stringify(updatedData[key]));
      } else {
        data.append(key, updatedData[key]);
      }
    });

    // Append files
    if (coverFile) data.append("coverImage", coverFile);
    if (logoFile) data.append("logoImage", logoFile);
    
    // Append multiple gallery files
    galleryFiles.forEach((file) => {
      data.append("galleryImages", file);
    });
    
    // Append service files with correct indexing
    Object.keys(serviceFiles).forEach((index) => {
      data.append(`serviceImages[${index}]`, serviceFiles[index]);
    });
    
    // Append product files with correct indexing
    Object.keys(productFiles).forEach((index) => {
      data.append(`productImages[${index}]`, productFiles[index]);
    });

    await axios.put(
      `https://navi-theni-2.onrender.com/api/stores/${editingStoreId}`,
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    alert("✅ Store updated successfully!");
    fetchStores();
    cancelEdit();
  } catch (err) {
    console.error("Error updating store:", err);
    alert("❌ Failed to update store");
  }
};


  const deleteStore = async (id) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      try {
        await axios.delete(`https://navi-theni-2.onrender.com/api/stores/${id}`);
        fetchStores();
      } catch (err) {
        console.error("Error deleting store:", err);
      }
    }
  };

  return (
    <div className="store-page">
      <h2>All Stores</h2>

      {isLoading && <div className="loading">Loading stores...</div>}

      {/* ✅ View More Modal */}
      {viewingStoreId && (
        <div className="modal">
          <div className="modal-content view-modal">
            <div className="modal-header">
              <h3>Store Details</h3>
              <button className="close-btnn" onClick={closeViewModal}>×</button>
            </div>
            
            <div className="view-content">
              <div className="store-banner">
                {viewData.coverImage && (
                  <img 
                    src={`https://navi-theni-2.onrender.com/${viewData.coverImage}`} 
                    alt="Cover" 
                    className="cover-img"
                  />
                )}
                <div className="store-profile">
                  {viewData.logoImage && (
                    <img 
                      src={`https://navi-theni-2.onrender.com/${viewData.logoImage}`} 
                      alt="Logo" 
                      className="logo-img"
                    />
                  )}
                  <div className="store-title">
                    <h2>{viewData.storeName}</h2>
                    <span className={`plan-badge ${viewData.plan}`}>{viewData.plan}</span>
                  </div>
                </div>
              </div>

              <div className="details-grid">
                <div className="detail-section">
                  <h4>Basic Information</h4>
                  <div className="detail-item">
                    <label>Category:</label>
                    <span>{viewData.category}</span>
                  </div>
                  <div className="detail-item">
                    <label>Description:</label>
                    <span>{viewData.description || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Review:</label>
                    <span>{viewData.review || "N/A"}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Location</h4>
                  <div className="detail-item">
                    <label>District:</label>
                    <span>{viewData.location?.district || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <label>City:</label>
                    <span>{viewData.location?.city || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Pincode:</label>
                    <span>{viewData.location?.pincode || "N/A"}</span>
                  </div>
                  {viewData.location?.maplink && (
                    <div className="detail-item">
                      <label>Map Link:</label>
                      <a href={viewData.location.maplink} target="_blank" rel="noopener noreferrer">View on Map</a>
                    </div>
                  )}
                </div>

                <div className="detail-section">
                  <h4>Contact Information</h4>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{viewData.phoneNumber || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <label>Website:</label>
                    {viewData.websiteLink ? (
                      <a href={viewData.websiteLink} target="_blank" rel="noopener noreferrer">
                        {viewData.websiteLink}
                      </a>
                    ) : (
                      <span>N/A</span>
                    )}
                  </div>
                  <div className="detail-item">
                    <label>About:</label>
                    <span>{viewData.aboutMe || "N/A"}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Social Media</h4>
                  {viewData.socialMediaLinks && Object.entries(viewData.socialMediaLinks).map(([platform, link]) => (
                    link && (
                      <div key={platform} className="detail-item">
                        <label>{platform.charAt(0).toUpperCase() + platform.slice(1)}:</label>
                        <a href={link} target="_blank" rel="noopener noreferrer">
                          {link}
                        </a>
                      </div>
                    )
                  ))}
                </div>

                {viewData.services && viewData.services.length > 0 && (
  <div className="detail-section full-width">
    <h4>Services ({viewData.services.length})</h4>
    <div className="items-grid">
      {viewData.services.map((service, index) => (
        <div key={index} className="item-card">
          {service.image && (
            <img 
              src={`https://navi-theni-2.onrender.com/${service.image}`} 
              alt={service.title} 
              className="item-img"
            />
          )}
          <div className="item-details">
            <h5>{service.title}</h5>
            <p>{service.description}</p>
          </div>
          <button 
            onClick={() => deleteService(viewData._id, index)}
            className="btn-delete-small"
            title="Delete Service"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  </div>
)}

               {viewData.products && viewData.products.length > 0 && (
  <div className="detail-section full-width">
    <h4>Products ({viewData.products.length})</h4>
    <div className="items-grid">
      {viewData.products.map((product, index) => (
        <div key={index} className="item-card">
          {product.image && (
            <img 
              src={`https://navi-theni-2.onrender.com/${product.image}`} 
              alt={product.title} 
              className="item-img"
            />
          )}
          <div className="item-details">
            <h5>{product.title}</h5>
            <p>{product.description}</p>
          </div>
          <button 
            onClick={() => deleteProduct(viewData._id, index)}
            className="btn-delete-small"
            title="Delete Product"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  </div>
)}

                {viewData.galleryImages && viewData.galleryImages.length > 0 && (
                  <div className="detail-section full-width">
                    <h4>Gallery ({viewData.galleryImages.length} images)</h4>
                    <div className="gallery-grid">
                      {viewData.galleryImages.map((img, index) => (
                        <div key={index} className="gallery-item">
                          <img 
                            src={`https://navi-theni-2.onrender.com/${img}`} 
                            alt={`Gallery ${index + 1}`} 
                            className="gallery-img"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

       {/* ✅ Edit Modal */}
      {editingStoreId && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Store</h3>
            <form onSubmit={handleUpdate} className="edit-form">
              <div className="form-section">
                <h4>Basic Information</h4>
                <div className="form-group">
                  <label>Store Name *</label>
                  <input
                    type="text"
                    name="storeName"
                    value={editData.storeName || ""}
                    onChange={handleChange}
                    placeholder="Store Name"
                    className={errors.storeName ? "error" : ""}
                  />
                  {errors.storeName && <span className="error-text">{errors.storeName}</span>}
                </div>
                
                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={editData.category || ""}
                    onChange={handleChange}
                    placeholder="Category"
                    className={errors.category ? "error" : ""}
                  />
                  {errors.category && <span className="error-text">{errors.category}</span>}
                </div>
                
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={editData.description || ""}
                    onChange={handleChange}
                    placeholder="Description"
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label>Plan</label>
                  <select 
                    name="plan" 
                    value={editData.plan || "gold"} 
                    onChange={handleChange}
                  >
                    <option value="gold">Gold</option>
                    <option value="diamond">Diamond</option>
                    <option value="platinum">Platinum</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Review</label>
                  <input
                    type="text"
                    name="review"
                    value={editData.review || ""}
                    onChange={handleChange}
                    placeholder="Review"
                  />
                </div>
              </div>
              
              <div className="form-section">
                <h4>Location</h4>
                <div className="form-group">
                  <label>District *</label>
                  <input
                    type="text"
                    name="location.district"
                    value={editData.location?.district || ""}
                    onChange={handleChange}
                    placeholder="District"
                    className={errors.district ? "error" : ""}
                  />
                  {errors.district && <span className="error-text">{errors.district}</span>}
                </div>
                
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="location.city"
                    value={editData.location?.city || ""}
                    onChange={handleChange}
                    placeholder="City"
                    className={errors.city ? "error" : ""}
                  />
                  {errors.city && <span className="error-text">{errors.city}</span>}
                </div>
                
                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="location.pincode"
                    value={editData.location?.pincode || ""}
                    onChange={handleChange}
                    placeholder="Pincode"
                    className={errors.pincode ? "error" : ""}
                  />
                  {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                </div>
                
                <div className="form-group">
                  <label>Map Link</label>
                  <input
                    type="text"
                    name="location.maplink"
                    value={editData.location?.maplink || ""}
                    onChange={handleChange}
                    placeholder="Map Link"
                  />
                </div>
              </div>
              
              <div className="form-section">
                <h4>About & Contact</h4>
                <div className="form-group">
                  <label>About Me</label>
                  <textarea
                    name="aboutMe"
                    value={editData.aboutMe || ""}
                    onChange={handleChange}
                    placeholder="About Me"
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={editData.phoneNumber || ""}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className={errors.phoneNumber ? "error" : ""}
                  />
                  {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
                </div>
                
                <div className="form-group">
                  <label>Website Link</label>
                  <input
                    type="text"
                    name="websiteLink"
                    value={editData.websiteLink || ""}
                    onChange={handleChange}
                    placeholder="Website Link"
                  />
                </div>
              </div>
              
              <div className="form-section">
                <h4>Social Media</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Instagram</label>
                    <input
                      type="text"
                      name="socialMediaLinks.instagram"
                      value={editData.socialMediaLinks?.instagram || ""}
                      onChange={handleChange}
                      placeholder="Instagram"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Facebook</label>
                    <input
                      type="text"
                      name="socialMediaLinks.facebook"
                      value={editData.socialMediaLinks?.facebook || ""}
                      onChange={handleChange}
                      placeholder="Facebook"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Twitter</label>
                    <input
                      type="text"
                      name="socialMediaLinks.twitter"
                      value={editData.socialMediaLinks?.twitter || ""}
                      onChange={handleChange}
                      placeholder="Twitter"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>YouTube</label>
                    <input
                      type="text"
                      name="socialMediaLinks.youtube"
                      value={editData.socialMediaLinks?.youtube || ""}
                      onChange={handleChange}
                      placeholder="YouTube"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="text"
                    name="socialMediaLinks.email"
                    value={editData.socialMediaLinks?.email || ""}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                </div>
              </div>

              {/* Services */}
              <div className="form-section">
                <div className="section-header">
                  <h4>Services</h4>
                  <button type="button" onClick={() => addNewField("services")} className="add-btn">
                    ➕ Add Service
                  </button>
                </div>
                
                {editData.services?.map((service, index) => (
                  <div key={index} className="field-group">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Service Title</label>
                        <input
                          type="text"
                          value={service.title || ""}
                          onChange={(e) =>
                            handleArrayChange(e, index, "title", "services")
                          }
                          placeholder="Service Title"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Service Description</label>
                        <input
                          type="text"
                          value={service.description || ""}
                          onChange={(e) =>
                            handleArrayChange(e, index, "description", "services")
                          }
                          placeholder="Service Description"
                        />
                      </div>
                    </div>

                    {/* Existing Preview */}
                    {service.image && (
                      <div className="image-preview">
                        <span>Current Image:</span>
                        <img
                          src={`https://navi-theni-2.onrender.com/${service.image}`}
                          alt="service"
                          className="thumb"
                        />
                      </div>
                    )}
                    
                    <div className="form-group">
                      <label>Service Image</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, index, "services")}
                      />
                    </div>
                    
                    <button type="button" onClick={() => removeField(index, "services")} className="remove-btn">
                      Remove Service
                    </button>
                  </div>
                ))}
              </div>

              {/* Products */}
              <div className="form-section">
                <div className="section-header">
                  <h4>Products</h4>
                  <button type="button" onClick={() => addNewField("products")} className="add-btn">
                    ➕ Add Product
                  </button>
                </div>
                
                {editData.products?.map((product, index) => (
                  <div key={index} className="field-group">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Product Title</label>
                        <input
                          type="text"
                          value={product.title || ""}
                          onChange={(e) =>
                            handleArrayChange(e, index, "title", "products")
                          }
                          placeholder="Product Title"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Product Description</label>
                        <input
                          type="text"
                          value={product.description || ""}
                          onChange={(e) =>
                            handleArrayChange(e, index, "description", "products")
                          }
                          placeholder="Product Description"
                        />
                      </div>
                    </div>

                    {/* Existing Preview */}
                    {product.image && (
                      <div className="image-preview">
                        <span>Current Image:</span>
                        <img
                          src={`https://navi-theni-2.onrender.com/${product.image}`}
                          alt="product"
                          className="thumb"
                        />
                      </div>
                    )}
                    
                    <div className="form-group">
                      <label>Product Image</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, index, "products")}
                      />
                    </div>
                    
                    <button type="button" onClick={() => removeField(index, "products")} className="remove-btn">
                      Remove Product
                    </button>
                  </div>
                ))}
              </div>

              {/* Images Section */}
              <div className="form-section">
                <h4>Store Images</h4>
                
                <div className="form-group">
                  <label>Cover Image</label>
                  {editData.coverImage && (
                    <div className="image-preview">
                      <span>Current Cover:</span>
                      <img
                        src={`https://navi-theni-2.onrender.com/${editData.coverImage}`}
                        alt="cover"
                        className="thumb"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={(e) => setCoverFile(e.target.files[0])}
                  />
                </div>

                <div className="form-group">
                  <label>Logo Image</label>
                  {editData.logoImage && (
                    <div className="image-preview">
                      <span>Current Logo:</span>
                      <img
                        src={`https://navi-theni-2.onrender.com/${editData.logoImage}`}
                        alt="logo"
                        className="thumb"
                      />
                    </div>
                  )}
                  <input type="file" onChange={(e) => setLogoFile(e.target.files[0])} />
                </div>

                <div className="form-group">
                  <label>Gallery Images</label>
                  <div className="gallery-preview">
                    {editData.galleryImages?.map((img, i) => (
                      <div key={i} className="gallery-item">
                        <img
                          src={`https://navi-theni-2.onrender.com/${img}`}
                          alt="gallery"
                          className="thumb"
                        />
                      </div>
                    ))}
                  </div>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setGalleryFiles(Array.from(e.target.files))}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">Update Store</button>
                <button type="button" onClick={cancelEdit} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Stores Table */}
      {stores.length === 0 ? (
        <div className="no-stores">No stores found</div>
      ) : (
        <div className="table-container">
          <table className="store-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Store Info</th>
                <th>Category</th>
                <th>Plan</th>
                <th>Location</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store, index) => (
                <tr key={store._id}>
                  <td>{index + 1}</td>
                  <td className="store-info">
                    <div className="store-header">
                      {store.logoImage && (
                        <img
                          src={`https://navi-theni-2.onrender.com/${store.logoImage}`}
                          alt="logo"
                          className="mini-thumb"
                        />
                      )}
                      <div className="store-details">
                        <div className="store-name">{store.storeName}</div>
                        {store.description && (
                          <div className="store-desc">{store.description.substring(0, 50)}...</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{store.category}</td>
                  <td>
                    <span className={`plan-badge ${store.plan}`}>
                      {store.plan}
                    </span>
                  </td>
                  <td>
                    {store.location && (
                      <div className="location-info">
                        <div>{store.location.district}</div>
                        <div>{store.location.city}</div>
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="contact-info">
                      {store.phoneNumber && <div>📞 {store.phoneNumber}</div>}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleViewMore(store)} className="btn-view">
                        View More
                      </button>
                      <button onClick={() => handleEdit(store)} className="btn-edit">
                        Edit
                      </button>
                      <button onClick={() => deleteStore(store._id)} className="btn-delete">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminStore;