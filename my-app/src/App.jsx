import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

import { ThemeProvider } from './Themecontext'
import Navbar from './component/Navbar'
import AssetManagementHomePage from './component/Home'
import RegisterPage from './component/Register'
import LoginPage from './component/Login'
import DashboardPage from './component/user/Dashboard'
import AssetsPage from './component/user/Assete'
import CategoriesPage from './component/user/Categories'
import ReportsPage from './component/user/Reports'
import AddAssetPage from './component/user/Addasset'
import AddUserPage from './component/user/AddUser'
import MaintenancePage from './component/user/Maintenance'
import AddMaintenancePage from './component/user/AddMaintenance'
import UsersPage from './component/user/User'

const publicRoutes = ['/', '/login', '/register']

function AppContent() {
  const location = useLocation()
  const isPublic = publicRoutes.includes(location.pathname)

  return (
    <>
      {isPublic && (
        <Navbar Title="AssetHub" About="About" isHomePage={location.pathname === '/'} isLoggedIn={false} />
      )}

      <Routes>
        <Route path="/"           element={<AssetManagementHomePage />} />
        <Route path="/login"      element={<LoginPage />} />
        <Route path="/register"   element={<RegisterPage />} />
        <Route path="/dashboard"  element={<DashboardPage />} />
        <Route path="/assets"     element={<AssetsPage />} />
        <Route path="/add-asset"  element={<AddAssetPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/reports"    element={<ReportsPage />} />
        <Route path="/users"      element={<UsersPage />} />
        <Route path="/users/add"  element={<AddUserPage />} />
        <Route path="/maintenance"     element={<MaintenancePage />} />
        <Route path="/maintenance/add" element={<AddMaintenancePage />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  )
}