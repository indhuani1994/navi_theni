import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import AdminLayout from './Component/AdminLayout/AdminLayout'
import AdminDashBoard from './Pages/admin/AdminDashBoard/AdminDashBoard'
import AdminStore from './Pages/admin/AdminStores/AdminStore'
import AdminCoupon from './Pages/admin/AdminCoupon/AdminCoupon'
import AdminJobs from './Pages/admin/AdminJobs/AdminJobs'
import AdminAdds from './Pages/admin/AdminAdds/AdminAdds'
import AdminEnquiry from './Pages/admin/AdminEnquiry/AdminEnquiry'
import AddStore from './Pages/admin/AdminStores/AddStore'
import CouponForm from './Pages/admin/AdminCoupon/CouponForm'
import AddJob from './Pages/admin/AdminJobs/AddJob'
import AddAd from './Pages/admin/AdminAdds/AddAd'
import Dashboard from './Pages/admin/AdminDashBoard/AdminDashBoard'
import UserTable from './Pages/admin/UserTable'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>


          <Route path='/' element={
            <AdminLayout><AdminDashBoard /></AdminLayout>
          } />
          <Route path='/admin/stores' element={
            <AdminLayout><AdminStore /></AdminLayout>
          } />
          <Route path='/admin/addstores' element={
            <AdminLayout><AddStore /></AdminLayout>
          } />
          <Route path='/admin/coupons' element={
            <AdminLayout><AdminCoupon /></AdminLayout>
          } />
          <Route path='/admin/addcoupons' element={
            <AdminLayout><CouponForm /></AdminLayout>
          } />
          <Route path='/admin/jobs' element={
            <AdminLayout><AdminJobs/></AdminLayout>
          } />
            <Route path='/admin/addjobs' element={
            <AdminLayout><AddJob/></AdminLayout>
          } />
          <Route path='/admin/ads' element={
            <AdminLayout><AdminAdds /></AdminLayout>
          } />
           <Route path='/admin/addads' element={
            <AdminLayout><AddAd /></AdminLayout>
          } />
          <Route path='/admin/enquiry' element={
            <AdminLayout><AdminEnquiry /></AdminLayout>
          } />

          <Route path='/admin/dashboard' element={
            <AdminLayout><Dashboard /></AdminLayout>
          } />

               <Route path='/admin/user' element={
            <AdminLayout><UserTable /></AdminLayout>
          } />


          </Routes>
            

          



      </BrowserRouter>


    </div>
  )
}

export default App