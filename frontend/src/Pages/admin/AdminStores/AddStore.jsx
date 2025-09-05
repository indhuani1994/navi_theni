import React, { useState } from "react";
import axios from "axios";
import "./AddStore.css";

const AddStore = () => {
  const [formData, setFormData] = useState({
    storeName: "",
    category: "",
    description: "",
    plan: "",
    review: "",
    location: { city: "", district: "", pincode: "",maplink:"" },
    aboutMe: "",
    phoneNumber: "",
    websiteLink: "",
    socialMediaLinks: { instagram: "", facebook: "", twitter: "", youtube: "", email: "" },
    services: [{ title: "", description: "" }],
    products: [{ title: "", description: "" }],
  });

  const [files, setFiles] = useState({
    coverImage: null,
    logoImage: null,
    galleryImages: [],
    serviceImages: [],
    productImages: [],
  });

  // ✅ Handle input changes (supports nested objects like location.city)
  const handleChange = (e) => {
    const { name, value } = e.target;
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

  // ✅ Handle file uploads
  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (e.target.multiple) {
      setFiles((prev) => ({ ...prev, [name]: [...selectedFiles] }));
    } else {
      setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      // add normal text fields
      data.append("storeName", formData.storeName);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("plan", formData.plan);
      data.append("review", formData.review);
      data.append("aboutMe", formData.aboutMe);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("websiteLink", formData.websiteLink);

      // nested objects (location + social links)
      Object.keys(formData.location).forEach((key) =>
        data.append(`location[${key}]`, formData.location[key])
      );
      Object.keys(formData.socialMediaLinks).forEach((key) =>
        data.append(`socialMediaLinks[${key}]`, formData.socialMediaLinks[key])
      );

      // arrays (services + products)
      data.append("services", JSON.stringify(formData.services));
      data.append("products", JSON.stringify(formData.products));

      // file uploads
      if (files.coverImage) data.append("coverImage", files.coverImage);
      if (files.logoImage) data.append("logoImage", files.logoImage);
      files.galleryImages.forEach((file) => data.append("galleryImages", file));
      files.serviceImages.forEach((file) => data.append("serviceImages", file));
      files.productImages.forEach((file) => data.append("productImages", file));

      await axios.post("http://localhost:4000/api/stores", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Store Added Successfully ✅");
    } catch (err) {
      console.error("Error adding store:", err);
      alert("Failed to add store ❌");
    }
  };

  return (
    <div className="add-store-page">
      <h2>Add New Store</h2>
      <form className="store-form" onSubmit={handleSubmit}>
        <label>Store Name</label>
        <input type="text" name="storeName" value={formData.storeName} onChange={handleChange} required />

        <label>Category</label>
        <input type="text" name="category" value={formData.category} onChange={handleChange} />

        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange}></textarea>

        <label>Plan</label>
        <input type="text" name="plan" value={formData.plan} onChange={handleChange} />

        <label>Review</label>
        <input type="text" name="review" value={formData.review} onChange={handleChange} />

        <label>Cover Image</label>
        <input type="file" name="coverImage" onChange={handleFileChange} />

        <label>Logo Image</label>
        <input type="file" name="logoImage" onChange={handleFileChange} />

        <label>Gallery Images</label>
        <input type="file" name="galleryImages" multiple onChange={handleFileChange} />

        <label>Location</label>
        <input type="text" name="location.city" placeholder="City" value={formData.location.city} onChange={handleChange} />
        <input type="text" name="location.district" placeholder="District" value={formData.location.district} onChange={handleChange} />
        <input type="text" name="location.pincode" placeholder="Pincode" value={formData.location.pincode} onChange={handleChange} />
        <input type="text" name="location.maplink" placeholder="Maplink" value={formData.location.maplink} onChange={handleChange} />

        <label>Phone Number</label>
        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />

        <label>Website</label>
        <input type="text" name="websiteLink" value={formData.websiteLink} onChange={handleChange} />

        <label>About Me</label>
        <textarea name="aboutMe" value={formData.aboutMe} onChange={handleChange}></textarea>

        <h3>Social Links</h3>
        <input type="text" name="socialMediaLinks.instagram" placeholder="Instagram" value={formData.socialMediaLinks.instagram} onChange={handleChange} />
        <input type="text" name="socialMediaLinks.facebook" placeholder="Facebook" value={formData.socialMediaLinks.facebook} onChange={handleChange} />
        <input type="text" name="socialMediaLinks.twitter" placeholder="Twitter" value={formData.socialMediaLinks.twitter} onChange={handleChange} />
        <input type="text" name="socialMediaLinks.youtube" placeholder="YouTube" value={formData.socialMediaLinks.youtube} onChange={handleChange} />
        <input type="email" name="socialMediaLinks.email" placeholder="Email" value={formData.socialMediaLinks.email} onChange={handleChange} />

        <h3>Services</h3>
        <input type="text" placeholder="Service Title" onChange={(e) => setFormData({ ...formData, services: [{ ...formData.services[0], title: e.target.value }] })} />
        <textarea placeholder="Service Description" onChange={(e) => setFormData({ ...formData, services: [{ ...formData.services[0], description: e.target.value }] })}></textarea>
        <input type="file" name="serviceImages" multiple onChange={handleFileChange} />

        <h3>Products</h3>
        <input type="text" placeholder="Product Title" onChange={(e) => setFormData({ ...formData, products: [{ ...formData.products[0], title: e.target.value }] })} />
        <textarea placeholder="Product Description" onChange={(e) => setFormData({ ...formData, products: [{ ...formData.products[0], description: e.target.value }] })}></textarea>
        <input type="file" name="productImages" multiple onChange={handleFileChange} />

        <button type="submit" className="submit-btn">Add Store</button>
      </form>
    </div>
  );
};

export default AddStore;
