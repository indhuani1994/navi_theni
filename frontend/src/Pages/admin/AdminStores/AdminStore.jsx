import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminStore.css";

const AdminStore = () => {
  const [stores, setStores] = useState([]);
  const [editingStoreId, setEditingStoreId] = useState(null);
  const [editData, setEditData] = useState({});
  const [coverFile, setCoverFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [serviceFiles, setServiceFiles] = useState([]);
  const [productFiles, setProductFiles] = useState([]);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/stores");
      setStores(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  };

  const handleEdit = (store) => {
    setEditingStoreId(store._id);
    setEditData({
      ...store,
      location: store.location || { city: "", district: "", pincode: "" },
      socialMediaLinks: store.socialMediaLinks || { instagram: "", facebook: "", twitter: "", youtube: "", email: "" },
      services: store.services || [],
      products: store.products || [],
    });
  };

  const cancelEdit = () => {
    setEditingStoreId(null);
    setEditData({});
    setCoverFile(null);
    setLogoFile(null);
    setGalleryFiles([]);
    setServiceFiles([]);
    setProductFiles([]);
  };

  const deleteStore = async (id) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      try {
        await axios.delete(`http://localhost:4000/api/stores/${id}`);
        fetchStores();
      } catch (err) {
        console.error("Error deleting store:", err);
      }
    }
  };

  return (
    <div className="store-page">
      <h2>All Stores</h2>

      <table className="store-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Store Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Plan</th>
            <th>Review</th>
            <th>Location</th>
            <th>About Me</th>
            <th>Phone</th>
            <th>Website</th>
            <th>Social Links</th>
            <th>Cover</th>
            <th>Logo</th>
            <th>Gallery</th>
            <th>Services</th>
            <th>Products</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store, index) => (
            <tr key={store._id}>
              <td>{index + 1}</td>
              <td>{store.storeName}</td>
              <td>{store.category}</td>
              <td>{store.description}</td>
              <td>{store.plan}</td>
              <td>{store.review}</td>
              <td>
                {store.location?.city}, {store.location?.district}, {store.location?.pincode}
              </td>
              <td>{store.aboutMe}</td>
              <td>{store.phoneNumber}</td>
              <td>
                <a href={store.websiteLink} target="_blank" rel="noreferrer">{store.websiteLink}</a>
              </td>
              <td>
                {store.socialMediaLinks?.instagram && <a href={store.socialMediaLinks.instagram} target="_blank" rel="noreferrer">IG</a>}{" "}
                {store.socialMediaLinks?.facebook && <a href={store.socialMediaLinks.facebook} target="_blank" rel="noreferrer">FB</a>}{" "}
                {store.socialMediaLinks?.twitter && <a href={store.socialMediaLinks.twitter} target="_blank" rel="noreferrer">TW</a>}{" "}
                {store.socialMediaLinks?.youtube && <a href={store.socialMediaLinks.youtube} target="_blank" rel="noreferrer">YT</a>}{" "}
                <br /> {store.socialMediaLinks?.email}
              </td>
              <td>
                {store.coverImage && <img src={`http://localhost:4000/${store.coverImage}`} alt="cover" className="thumb" />}
              </td>
              <td>
                {store.logoImage && <img src={`http://localhost:4000/${store.logoImage}`} alt="logo" className="thumb" />}
              </td>
              <td>
                {store.galleryImages?.map((img, i) => (
                  <img key={i} src={`http://localhost:4000/${img}`} alt="gallery" className="thumb" />
                ))}
              </td>
              <td>
                {store.services?.map((s, i) => (
                  <div key={i}>
                    <b>{s.title}</b>
                    {s.image && <img src={`http://localhost:4000/${s.image}`} alt="service" className="mini-thumb" />}
                    <p>{s.description}</p>
                  </div>
                ))}
              </td>
              <td>
                {store.products?.map((p, i) => (
                  <div key={i}>
                    <b>{p.title}</b>
                    {p.image && <img src={`http://localhost:4000/${p.image}`} alt="product" className="mini-thumb" />}
                    <p>{p.description}</p>
                  </div>
                ))}
              </td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(store)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteStore(store._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStore;
