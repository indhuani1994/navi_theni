import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api/users";

export default function UserTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  if (users.length === 0)
    return (
      <p style={{ textAlign: "center", marginTop: "20px" }}>No users found.</p>
    );

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        background: "#f5f6fa",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "#2c3e50",
          textTransform: "uppercase",
        }}
      >
        All Users
      </h2>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: "#2c3e50", color: "#fff", textAlign: "left" }}>
              <th style={{ padding: "12px 15px" }}>Name</th>
              <th style={{ padding: "12px 15px" }}>Email</th>
              <th style={{ padding: "12px 15px" }}>Phone Number</th>
              <th style={{ padding: "12px 15px" }}>Gender</th>
              <th style={{ padding: "12px 15px" }}>Age</th>
              <th style={{ padding: "12px 15px" }}>Role</th>
              <th style={{ padding: "12px 15px" }}>Address</th> {/* Added */}
              <th style={{ padding: "12px 15px" }}>Created At</th>
              <th style={{ padding: "12px 15px" }}>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                style={{ background: index % 2 === 0 ? "#f9f9f9" : "#fff" }}
              >
                <td style={{ padding: "12px 15px" }}>{user.name}</td>
                <td style={{ padding: "12px 15px" }}>{user.email}</td>
                <td style={{ padding: "12px 15px" }}>{user.phoneNumber}</td>
                <td style={{ padding: "12px 15px", textTransform: "capitalize" }}>
                  {user.gender}
                </td>
                <td style={{ padding: "12px 15px" }}>{user.age}</td>
                <td style={{ padding: "12px 15px", textTransform: "capitalize" }}>
                  {user.role}
                </td>
                <td style={{ padding: "12px 15px" }}>{user.address}</td> {/* Added */}
                <td style={{ padding: "12px 15px" }}>
                  {new Date(user.createdAt).toLocaleString()}
                </td>
                <td style={{ padding: "12px 15px" }}>
                  {new Date(user.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
