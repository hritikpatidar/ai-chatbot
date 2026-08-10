import { Routes, Route } from "react-router-dom";
import { PublicRoute } from "./PublicRoute";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import { PrivateRoute } from "./PrivateRoute";
import Welcome from "../pages/Welcome";
import ChatContainer from "../pages/ChatContainer";
import Library from "../pages/Library";
import Projects from "../pages/Projects";
import Scheduled from "../pages/Scheduled";
import Plugins from "../pages/Plugins";
import Settings from "../pages/Settings";
import DashboardLayout from "../pages/DashboardLayout";
import TermsConditions from "../pages/TermsConditions";
import ForgotPassword from "../pages/ForgotPassword";
import OTPVerification from "../pages/OTPVerification";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import ResetPassword from "../pages/ResetPassword";
import { SocketProvider } from "../context/SocketContext";
import Profile from "../pages/Profile";
import Security from "../pages/Security";

export default function AppRoutes() {
  return (
    <SocketProvider>
      <Routes>
        {/* Public */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
          <Route path="//privacy-policy" element={<PrivacyPolicy />} />
        </Route>

        {/* Private */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Welcome />} />
            <Route path="/c/:conversationId" element={<ChatContainer />} />
            <Route path="/library" element={<Library />} />
            <Route path="/projects" element={<Projects />} />
            {/* <Route path="/scheduled" element={<Scheduled />} />
          <Route path="/plugins" element={<Plugins />} /> */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/security" element={<Security />} />
          </Route>
        </Route>
      </Routes>
    </SocketProvider>
  );
}
