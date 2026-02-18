import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import MobileLayout from "@/components/MobileLayout";
import RoleGuard from "@/components/RoleGuard";

// Pages
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import RestaurantDetailPage from "@/pages/RestaurantDetailPage";
import ReservationPage from "@/pages/ReservationPage";
import CartPage from "@/pages/CartPage";
import OrdersPage from "@/pages/OrdersPage";
import ProfilePage from "@/pages/ProfilePage";
import NotificationsPage from "@/pages/NotificationsPage";
import ReviewsPage from "@/pages/ReviewsPage";
import CouponsPage from "@/pages/CouponsPage";
import FavoritesPage from "@/pages/FavoritesPage";
import NotFound from "@/pages/NotFound";

// Auth Pages
import WelcomePage from "@/pages/auth/WelcomePage";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import OTPVerificationPage from "@/pages/auth/OTPVerificationPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import RestaurantRegisterPage from "@/pages/auth/RestaurantRegisterPage";

// Legal Pages
import TermsPage from "@/pages/legal/TermsPage";
import PrivacyPage from "@/pages/legal/PrivacyPage";

// Settings Pages
import SettingsPage from "@/pages/settings/SettingsPage";
import EditProfilePage from "@/pages/settings/EditProfilePage";
import AddressesPage from "@/pages/settings/AddressesPage";
import PaymentMethodsPage from "@/pages/settings/PaymentMethodsPage";
import NotificationSettingsPage from "@/pages/settings/NotificationSettingsPage";
import LanguagePage from "@/pages/settings/LanguagePage";
import HelpPage from "@/pages/settings/HelpPage";
import AboutPage from "@/pages/settings/AboutPage";

// Owner Pages
import OwnerDashboardPage from "@/pages/owner/OwnerDashboardPage";
import MenuManagementPage from "@/pages/owner/MenuManagementPage";
import OrderManagementPage from "@/pages/owner/OrderManagementPage";
import ReservationManagementPage from "@/pages/owner/ReservationManagementPage";
import CampaignManagementPage from "@/pages/owner/CampaignManagementPage";
import QRCodePage from "@/pages/owner/QRCodePage";

// Admin Pages
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import UserManagementPage from "@/pages/admin/UserManagementPage";
import RestaurantApprovalPage from "@/pages/admin/RestaurantApprovalPage";
import EventManagementPage from "@/pages/admin/EventManagementPage";
import SystemNotificationsPage from "@/pages/admin/SystemNotificationsPage";
import ReportsPage from "@/pages/admin/ReportsPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-center" richColors />
          <MobileLayout>
            <Routes>
              {/* Main Customer Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route
                path="/restaurant/:id"
                element={<RestaurantDetailPage />}
              />
              <Route
                path="/restaurant/:id/reserve"
                element={<ReservationPage />}
              />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/coupons" element={<CouponsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />

              {/* Auth Routes */}
              <Route path="/welcome" element={<WelcomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/otp-verification"
                element={<OTPVerificationPage />}
              />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route
                path="/register-restaurant"
                element={<RestaurantRegisterPage />}
              />

              {/* Legal Routes */}
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />

              {/* Settings Routes */}
              <Route path="/settings" element={<SettingsPage />} />
              <Route
                path="/settings/edit-profile"
                element={<EditProfilePage />}
              />
              <Route path="/settings/addresses" element={<AddressesPage />} />
              <Route
                path="/settings/payment"
                element={<PaymentMethodsPage />}
              />
              <Route
                path="/settings/notifications"
                element={<NotificationSettingsPage />}
              />
              <Route path="/settings/language" element={<LanguagePage />} />
              <Route path="/settings/help" element={<HelpPage />} />
              <Route path="/settings/about" element={<AboutPage />} />

              {/* Restaurant Owner Routes */}
              <Route
                path="/owner/dashboard"
                element={
                  <RoleGuard allowedRoles={["restaurant"]}>
                    <OwnerDashboardPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/owner/menu"
                element={
                  <RoleGuard allowedRoles={["restaurant"]}>
                    <MenuManagementPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/owner/orders"
                element={
                  <RoleGuard allowedRoles={["restaurant"]}>
                    <OrderManagementPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/owner/reservations"
                element={
                  <RoleGuard allowedRoles={["restaurant"]}>
                    <ReservationManagementPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/owner/campaigns"
                element={
                  <RoleGuard allowedRoles={["restaurant"]}>
                    <CampaignManagementPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/owner/qr-code"
                element={
                  <RoleGuard allowedRoles={["restaurant"]}>
                    <QRCodePage />
                  </RoleGuard>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <RoleGuard allowedRoles={["admin"]}>
                    <AdminDashboardPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <RoleGuard allowedRoles={["admin"]}>
                    <UserManagementPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/admin/restaurants"
                element={
                  <RoleGuard allowedRoles={["admin"]}>
                    <RestaurantApprovalPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <RoleGuard allowedRoles={["admin"]}>
                    <EventManagementPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/admin/notifications"
                element={
                  <RoleGuard allowedRoles={["admin"]}>
                    <SystemNotificationsPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <RoleGuard allowedRoles={["admin"]}>
                    <ReportsPage />
                  </RoleGuard>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MobileLayout>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
