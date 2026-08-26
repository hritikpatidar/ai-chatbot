import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";
import { SocketProvider } from "../context/SocketContext";
import PageLoader from "../components/common/PageLoader";
import DashboardLayout from "../pages/DashboardLayout";
import ClientLayout from "../pages/Client/ClientLayout";
import ClientRoute from "./ClientRoute";
import AdminLayout from "../pages/Admin/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminClient from "../pages/Admin/AdminClients";
import AdminProfile from "../pages/Admin/AdminProfile";
import AdminSettings from "../pages/Admin/AdminSettings";
import AdminSubscriptions from "../pages/Admin/AdminSubscriptions";
import AdminAnalytics from "../pages/Admin/AdminAnalytics";
import AdminClientView from "../pages/Admin/AdminClientView";
import ScrollToTop from "../components/ScrollToTop";

// Public Pages

const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const OTPVerification = lazy(() => import("../pages/OTPVerification"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const TermsConditions = lazy(() => import("../pages/TermsConditions"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));

// Chat Pages
// Public + Private

const Welcome = lazy(() => import("../pages/Welcome"));
const ChatContainer = lazy(() => import("../pages/ChatContainer"));

// Private Pages

const Library = lazy(() => import("../pages/Library"));
const Projects = lazy(() => import("../pages/Projects"));
const Settings = lazy(() => import("../pages/Settings"));
const Profile = lazy(() => import("../pages/Profile"));
const Security = lazy(() => import("../pages/Security"));

// Admin Pages

const ClientDashboard = lazy(() => import("../pages/Client/ClientDashboard"));
const ClientSettings = lazy(() => import("../pages/Client/ClientSettings"));
const ChatbotSettings = lazy(() => import("../pages/Client/ChatbotSettings"));
const ClientProducts = lazy(() => import("../pages/Client/ClientProducts"));
const ClientFAQs = lazy(() => import("../pages/Client/ClientFAQs"));
const ClientTickets = lazy(() => import("../pages/Client/ClientTickets"));
const SubscriptionPlans = lazy(
  () => import("../pages/Admin/SubscriptionPlans/SubscriptionPlans"),
);

const SubscriptionPlanDetails = lazy(
  () => import("../pages/Admin/SubscriptionPlans/SubscriptionPlanDetails"),
);

export default function AppRoutes() {
  return (
    <SocketProvider>
      <ScrollToTop />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* PUBLIC AUTH ROUTES */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp-verification" element={<OTPVerification />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/terms-and-conditions" element={<TermsConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Route>

          {/* =========================================
              CHAT ROUTES
              
              IMPORTANT:
              These are NOT inside PrivateRoute.
              
              Logged-in + Guest both can access.

              Guest user ko / route per jane se rokne ke liye ClientRoute add kiya hai ye login per redirect karega
          ========================================== */}
          <Route element={<ClientRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Welcome />} />
              <Route path="/c/:conversationId" element={<ChatContainer />} />
            </Route>
          </Route>

          {/* PRIVATE USER ROUTES */}
          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/library" element={<Library />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/security" element={<Security />} />
            </Route>
          </Route>

          {/* PRIVATE CLIENT ROUTES */}
          <Route element={<PrivateRoute allowedRoles={["client"]} />}>
            <Route element={<ClientLayout />}>
              <Route path="/client">
                <Route index element={<ClientDashboard />} />
                <Route path="products" element={<ClientProducts />} />
                <Route path="faqs" element={<ClientFAQs />} />
                <Route path="chatbot-settings" element={<ChatbotSettings />} />
                <Route path="client-settings" element={<ClientSettings />} />
                <Route path="tickets" element={<ClientTickets />} />
              </Route>
            </Route>
          </Route>

          {/* PRIVATE ADMIN ROUTES */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin">
                <Route index element={<AdminDashboard />} />
                <Route path="/admin/clients" element={<AdminClient />} />
                <Route
                  path="/admin/clients/:clientId"
                  element={<AdminClientView />}
                />
                <Route path="/admin/profile" element={<AdminProfile />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route
                  path="/admin/subscriptions"
                  element={<AdminSubscriptions />}
                />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route
                  path="/admin/subscription-plans"
                  element={<SubscriptionPlans />}
                />

                <Route
                  path="/admin/subscription-plans/:planId"
                  element={<SubscriptionPlanDetails />}
                />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Welcome />} />
        </Routes>
      </Suspense>
    </SocketProvider>
  );
}
