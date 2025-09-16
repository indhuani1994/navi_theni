import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSideBar = () => {
  const [openStores, setOpenStores] = useState(false);
  const [openCoupons, setOpenCoupons] = useState(false);
  const [openJobs, setOpenJobs] = useState(false);
  const [openAds, setOpenAds] = useState(false); // new state for Ads dropdown

  return (
    <aside className="admin-sidebar">
      <h2 className="admin-sidebar-title">Admin Panel</h2>
      <nav className="admin-sidebar-nav">
        <NavLink to="/admin/dashboard" className="sidebar-link">Dashboard</NavLink>

         {/* Ads Dropdown */}
        <div>
          <button
            className="sidebar-link dropdown-btn"
            onClick={() => setOpenAds(!openAds)}
          >
            Ads {openAds ? "▲" : "▼"}
          </button>
          {openAds && (
            <div className="dropdown-menu">
              <NavLink to="/admin/ads" className="sidebar-sublink">All Ads</NavLink>
              <NavLink to="/admin/addads" className="sidebar-sublink">Add Ad</NavLink>
            </div>
          )}
        </div>


        {/* Stores Dropdown */}
        <div>
          <button
            className="sidebar-link dropdown-btn"
            onClick={() => setOpenStores(!openStores)}
          >
            Stores {openStores ? "▲" : "▼"}
          </button>
          {openStores && (
            <div className="dropdown-menu">
              <NavLink to="/admin/stores" className="sidebar-sublink">All Stores</NavLink>
              <NavLink to="/admin/addstores" className="sidebar-sublink">Add Store</NavLink>
            </div>
          )}
        </div>

        {/* Coupons Dropdown */}
        <div>
          <button
            className="sidebar-link dropdown-btn"
            onClick={() => setOpenCoupons(!openCoupons)}
          >
            Coupons {openCoupons ? "▲" : "▼"}
          </button>
          {openCoupons && (
            <div className="dropdown-menu">
              <NavLink to="/admin/coupons" className="sidebar-sublink">All Coupons</NavLink>
              <NavLink to="/admin/addcoupons" className="sidebar-sublink">Add Coupon</NavLink>
            </div>
          )}
        </div>

        {/* Jobs Dropdown */}
        <div>
          <button
            className="sidebar-link dropdown-btn"
            onClick={() => setOpenJobs(!openJobs)}
          >
            Jobs {openJobs ? "▲" : "▼"}
          </button>
          {openJobs && (
            <div className="dropdown-menu">
              <NavLink to="/admin/jobs" className="sidebar-sublink">All Jobs</NavLink>
              <NavLink to="/admin/addjobs" className="sidebar-sublink">Add Job</NavLink>
            </div>
          )}
        </div>

       
        <NavLink to="/admin/enquiry" className="sidebar-link">Enquiry</NavLink>
        <NavLink to="/admin/user" className="sidebar-link">users</NavLink>
      </nav>
    </aside>
  );
};

export default AdminSideBar;
