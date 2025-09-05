import React from 'react'
import AdminSideBar from '../AdminSideBar/AdminSideBar'
import AdminHeader from '../AdminHeader/AdminHeader'
import "./adminlayout.css"

const AdminLayout = ({ children }) => {
  return (
     <div className="admin-layout">
      <AdminSideBar />
      <div className="admin-main">
        <AdminHeader />
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout