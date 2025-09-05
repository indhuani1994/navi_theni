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
        "http://localhost:4000/api/admin/change-password",
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
          <h1>Dream Cart</h1>
        </div>
        <div className="admin-header-right">
          {user && <span className="admin-username">Welcome, {user.name}</span>}
          <button className="profile-btn" onClick={() => setShowProfile(true)}>
            Profile
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
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
