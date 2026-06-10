import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import MainLayout from "../layout/MainLayout";
import DashboardLayout from "../layout/DashboardLayout";
import ProtectedRoute from "../auth/ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Listings from "../pages/Listings";
import About from "../pages/About";
import PropertyDetail from "../pages/PropertyDetail";

import DashboardPage from "../pages/dashboards/admin/DashboardPage";
import UsersPage from "../pages/dashboards/admin/UsersPage";
import PropertiesPage from "../pages/dashboards/admin/PropertiesPage";

import Dashboard from "../pages/dashboards/user/Dashboard";
import SavedCompare from "../pages/dashboards/user/SavedCompare";

import OwnerDashboard from "../pages/dashboards/owner/OwnerDashboard";
import Properties from "../pages/dashboards/owner/Properties";
import AddProperty from "../pages/dashboards/owner/AddProperty";

import Profile from "../components/dashboard/Profile";

export default function Router() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/properties" element={<Listings />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/about" element={<About />} />
      </Route>

      {/* User dashboard — protected, role: user */}
      <Route
        path="/dashboard/user"
        element={
          <ProtectedRoute role="user">
            <DashboardLayout role="user" />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="saved" element={<SavedCompare />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Owner dashboard — protected, role: owner */}
      <Route
        path="/dashboard/owner"
        element={
          <ProtectedRoute role="owner">
            <DashboardLayout role="owner" />
          </ProtectedRoute>
        }
      >
        <Route index element={<OwnerDashboard />} />
        <Route path="properties" element={<Properties />} />
        <Route path="add" element={<AddProperty />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Admin dashboard — protected, role: admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="properties" element={<PropertiesPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
