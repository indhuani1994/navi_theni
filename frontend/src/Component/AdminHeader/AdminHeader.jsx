import React, { useState } from 'react';
import './AdminHeader.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminHeader = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const [showProfile, setShowProfile] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "https://navi-theni-2.onrender.com/api/admin/change-password",
        { password },
        { headers: { token } }
      );
      setMessage(res.data.message);
      setPassword("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <>
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>Theni</h1>
        </div>
       
      </header>

      {/* 🔹 Profile Modal */}
      {showProfile && (
        <div className="profile-modal">
          <div className="profile-modal-content">
            <h2>Admin Profile</h2>
            <p><strong>Email:</strong> {user?.email}</p>

            <form onSubmit={handlePasswordUpdate}>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="modal-actions">
                <button type="submit" className="update-btn">Update Password</button>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowProfile(false)}
                >
                  Close
                </button>
              </div>
            </form>

            {message && <p className="message">{message}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;
