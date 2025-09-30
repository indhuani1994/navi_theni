import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminEnquiry.css";

const AdminEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://navi-theni-2.onrender.com/api/enquiries");
      setEnquiries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`https://navi-theni-2.onrender.com/api/enquiries/${id}`, { status: newStatus });
      fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading enquiries...</p>;

  return (
    <div className="enquiry-container">
      <h2>Enquiries</h2>
      <table className="enquiry-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Store</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((enquiry) => (
            <tr key={enquiry._id}>
              <td>{enquiry.name}</td>
              <td>{enquiry.email}</td>
              <td>{enquiry.phone || "-"}</td>
              <td>{enquiry.subject}</td>
              <td>{enquiry.message}</td>
              <td>{enquiry.storeName ? enquiry.storeName.storeName : "-"}</td>
              <td className={enquiry.status === "pending" ? "status-pending" : "status-resolved"}>
                {enquiry.status.toUpperCase()}
              </td>
              <td>
                {enquiry.status === "pending" ? (
                  <button className="action-btn resolve-btn" onClick={() => updateStatus(enquiry._id, "resolved")}>
                    Mark Resolved
                  </button>
                ) : (
                  <button className="action-btn pending-btn" onClick={() => updateStatus(enquiry._id, "pending")}>
                    Mark Pending
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminEnquiry;
