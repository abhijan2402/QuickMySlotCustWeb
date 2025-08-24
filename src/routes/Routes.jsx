// routes/Routes.jsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "../pages/TermsAndConditions";
import NotFound from "../pages/NotFound";
import ServicesPage from "../pages/ServicesPage";
import ServiceDetailPage from "../components/ShopServices/ServiceDetailPage";
import ProfilePage from "../pages/ProfilePage";
import Appointments from "../pages/Appointments";
import BookServicePage from "../components/ShopServices/BookServicePage";
import Support from "../pages/Support";
import AboutPage from "../pages/AboutPage";
import AppointmentDetails from "../pages/AppointmentDetails";
import NotificationsPage from "../pages/NotificationsPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ✅ Routes WITH Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services/:type" element={<ServicesPage />} />
        <Route path="/services/:type/:shopId" element={<ServiceDetailPage />} />
        <Route path="/book-service/:shopId" element={<BookServicePage />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route
          path="/appointments/:type/:id"
          element={<AppointmentDetails />}
        />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/support" element={<Support />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
