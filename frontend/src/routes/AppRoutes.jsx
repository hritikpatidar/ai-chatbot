import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";
import { SocketProvider } from "../context/SocketContext";
import PageLoader from "../components/common/PageLoader";
import ClientRoute from "./ClientRoute";
import ClientChatRoute from "./ClientChatRoute";
import DashboardLayout from "../pages/DashboardLayout";
import ClientLayout from "../pages/Client/ClientLayout";

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

export default function AppRoutes() {
  return (
    <SocketProvider>
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

              Guest user ko / route per jane se rokne ke liye ClientChatRoute add kiya hai ye login per redirect karega
          ========================================== */}
          <Route element={<ClientChatRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Welcome />} />
              <Route path="/c/:conversationId" element={<ChatContainer />} />
            </Route>
          </Route>

          {/* PRIVATE ROUTES */}

          <Route element={<PrivateRoute />}>
            {/* PRIVATE USER ROUTES */}
            <Route element={<DashboardLayout />}>
              <Route path="/library" element={<Library />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/security" element={<Security />} />
            </Route>
            {/* PRIVATE Client ROUTES */}
            <Route element={<ClientRoute />}>
              <Route path="/client" element={<ClientLayout />}>
                <Route index element={<ClientDashboard />} />
                <Route path="products" element={<ClientProducts />} />
                <Route path="faqs" element={<ClientFAQs />} />
                <Route path="chatbot-settings" element={<ChatbotSettings />} />
                <Route path="client-settings" element={<ClientSettings />} />
                <Route path="tickets" element={<ClientTickets />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </SocketProvider>
  );
}
