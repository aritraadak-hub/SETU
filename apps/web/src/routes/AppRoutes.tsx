import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { HomePage } from '../pages/home/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { CircuitsListingPage } from '../pages/circuits/CircuitsListingPage';
import { CircuitDetailPage } from '../pages/circuits/CircuitDetailPage';
import { DestinationsListingPage } from '../pages/destinations/DestinationsListingPage';
import { DestinationDetailPage } from '../pages/destinations/DestinationDetailPage';
import { DistrictsListingPage } from '../pages/districts/DistrictsListingPage';
import { DistrictDetailPage } from '../pages/districts/DistrictDetailPage';
import { MapsPage } from '../pages/maps/MapsPage';
import { CalendarPage } from '../pages/calendar/CalendarPage';
import { ExperienceListingPage } from '../pages/experience/ExperienceListingPage';
import { ExperienceDetailPage } from '../pages/experience/ExperienceDetailPage';
import { OfferingsListingPage } from '../pages/offerings/OfferingsListingPage';
import { OfferingDetailPage } from '../pages/offerings/OfferingDetailPage';
import { AccountPage } from '../pages/tourist/AccountPage';
import { VendorDashboardPage } from '../pages/vendor/VendorDashboardPage';
import { LocalVendorDashboardPage } from '../pages/vendor/LocalVendorDashboardPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';

import { VendorNotificationsPage } from '../pages/vendor/VendorNotificationsPage';
import { VendorMessagesPage } from '../pages/vendor/VendorMessagesPage';
import { VendorStorefrontPage } from '../pages/vendor/VendorStorefrontPage';

import { MessagesPage } from '../pages/account/MessagesPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Explore Routes */}
      <Route path="/explore/circuits" element={<CircuitsListingPage />} />
      <Route path="/explore/circuits/:slug" element={<CircuitDetailPage />} />

      <Route path="/explore/destinations" element={<DestinationsListingPage />} />
      <Route path="/explore/destinations/:slug" element={<DestinationDetailPage />} />

      <Route path="/explore/districts" element={<DistrictsListingPage />} />
      <Route path="/explore/districts/:slug" element={<DistrictDetailPage />} />

      {/* Interactive Maps */}
      <Route path="/maps" element={<MapsPage />} />

      {/* Calendar & Events */}
      <Route path="/calendar" element={<CalendarPage />} />

      {/* Cultural Experience */}
      <Route path="/experience" element={<ExperienceListingPage />} />
      <Route path="/experience/:category" element={<ExperienceListingPage />} />
      <Route path="/experience/:category/:slug" element={<ExperienceDetailPage />} />

      {/* Bookable Offerings */}
      <Route path="/offerings" element={<OfferingsListingPage />} />
      <Route path="/offerings/:slug" element={<OfferingDetailPage />} />

      {/* Public Vendor Storefront */}
      <Route path="/vendors/:slug" element={<VendorStorefrontPage />} />

      {/* Tourist Account & Messages */}
      <Route path="/account/messages" element={<MessagesPage />} />
      <Route path="/account/*" element={<AccountPage />} />

      {/* Vendor Specific Pages */}
      <Route path="/vendor/notifications" element={<VendorNotificationsPage />} />
      <Route path="/vendor/messages" element={<VendorMessagesPage />} />
      <Route path="/vendor/storefront-preview" element={<VendorStorefrontPage isPreview={true} />} />
      <Route path="/vendor/local-dashboard" element={<LocalVendorDashboardPage />} />
      <Route path="/vendor/*" element={<VendorDashboardPage />} />

      {/* Admin Management */}
      <Route path="/admin/*" element={<AdminDashboardPage />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
