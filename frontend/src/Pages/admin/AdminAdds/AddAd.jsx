import React, { useState } from "react";
import axios from "axios";
import "./Addad.css"

const AddAd = ({ refreshAds }) => {
  const [category, setCategory] = useState("hero");
  const [hero, setHero] = useState({ image: null, title: "", description: "", buttonName: "", buttonUrl: "", btnBackgroundColor: "" });
  const [strap, setStrap] = useState({ image: null });
  const [coupon, setCoupon] = useState({ image: null });
  const [slider, setSlider] = useState({ logoImage: null, title: "", content: "", buttonName: "", buttonColor: "", buttonUrl: "", buttonBackgroundColor: "" });

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "hero") setHero({ ...hero, [name]: value });
    if (type === "strap") setStrap({ ...strap, [name]: value });
    if (type === "coupon") setCoupon({ ...coupon, [name]: value });
    if (type === "slider") setSlider({ ...slider, [name]: value });
  };

  const handleFileChange = (e, type, field) => {
    const file = e.target.files[0];
    if (type === "hero") setHero({ ...hero, [field]: file });
    if (type === "strap") setStrap({ ...strap, [field]: file });
    if (type === "coupon") setCoupon({ ...coupon, [field]: file });
    if (type === "slider") setSlider({ ...slider, [field]: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("category", category);

    if (category === "hero") {
      formData.append("hero", JSON.stringify({ title: hero.title, description: hero.description, buttonName: hero.buttonName, buttonUrl: hero.buttonUrl, btnBackgroundColor: hero.btnBackgroundColor }));
      if (hero.image) formData.append("hero[image]", hero.image);
    }
    if (category === "strap" && strap.image) formData.append("strap[image]", strap.image);
    if (category === "coupon" && coupon.image) formData.append("coupon[image]", coupon.image);
    if (category === "slider") {
      formData.append("slider", JSON.stringify({ title: slider.title, content: slider.content, buttonName: slider.buttonName, buttonColor: slider.buttonColor, buttonUrl: slider.buttonUrl, buttonBackgroundColor: slider.buttonBackgroundColor }));
      if (slider.logoImage) formData.append("slider[logoImage]", slider.logoImage);
    }

    try {
      await axios.post("http://localhost:4000/api/ads", formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Advertisement added successfully!");
      refreshAds(); // refresh list after adding
      // reset form
      setHero({ image: null, title: "", description: "", buttonName: "", buttonUrl: "", btnBackgroundColor: "" });
      setStrap({ image: null });
      setCoupon({ image: null });
      setSlider({ logoImage: null, title: "", content: "", buttonName: "", buttonColor: "", buttonUrl: "", buttonBackgroundColor: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Error adding advertisement");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ad-form">
      <label>Category:</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="hero">Hero</option>
        <option value="strap">Strap</option>
        <option value="coupon">Coupon</option>
        <option value="slider">Slider</option>
      </select>

      {category === "hero" && (
        <>
          <input type="text" name="title" placeholder="Title" value={hero.title} onChange={(e) => handleChange(e, "hero")} />
          <input type="text" name="description" placeholder="Description" value={hero.description} onChange={(e) => handleChange(e, "hero")} />
          <input type="text" name="buttonName" placeholder="Button Name" value={hero.buttonName} onChange={(e) => handleChange(e, "hero")} />
          <input type="text" name="buttonUrl" placeholder="Button URL" value={hero.buttonUrl} onChange={(e) => handleChange(e, "hero")} />
          <input type="text" name="btnBackgroundColor" placeholder="Button Background Color" value={hero.btnBackgroundColor} onChange={(e) => handleChange(e, "hero")} />
          <input type="file" onChange={(e) => handleFileChange(e, "hero", "image")} />
        </>
      )}

      {category === "strap" && <input type="file" onChange={(e) => handleFileChange(e, "strap", "image")} />}
      {category === "coupon" && <input type="file" onChange={(e) => handleFileChange(e, "coupon", "image")} />}
      {category === "slider" && (
        <>
          <input type="text" name="title" placeholder="Title" value={slider.title} onChange={(e) => handleChange(e, "slider")} />
          <input type="text" name="content" placeholder="Content" value={slider.content} onChange={(e) => handleChange(e, "slider")} />
          <input type="text" name="buttonName" placeholder="Button Name" value={slider.buttonName} onChange={(e) => handleChange(e, "slider")} />
          <input type="text" name="buttonColor" placeholder="Button Color" value={slider.buttonColor} onChange={(e) => handleChange(e, "slider")} />
          <input type="text" name="buttonUrl" placeholder="Button URL" value={slider.buttonUrl} onChange={(e) => handleChange(e, "slider")} />
          <input type="text" name="buttonBackgroundColor" placeholder="Button Background Color" value={slider.buttonBackgroundColor} onChange={(e) => handleChange(e, "slider")} />
          <input type="file" onChange={(e) => handleFileChange(e, "slider", "logoImage")} />
        </>
      )}

      <button type="submit">Add Advertisement</button>
    </form>
  );
};

export default AddAd;
