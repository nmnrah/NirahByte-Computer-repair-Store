/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Public pages
import Home from './pages/public/Home';
import Booking from './pages/public/Booking';

// Admin pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Appointments from './pages/admin/Appointments';
import Services from './pages/admin/Services';
import BusinessHours from './pages/admin/BusinessHours';
import BlockedDates from './pages/admin/BlockedDates';
import Settings from './pages/admin/Settings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<Booking />} />
          </Route>

          {/* Admin Auth Route */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/appointments" element={<Appointments />} />
              <Route path="/admin/services" element={<Services />} />
              <Route path="/admin/hours" element={<BusinessHours />} />
              <Route path="/admin/blocked-dates" element={<BlockedDates />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
