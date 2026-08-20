import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import GuestHeader from "../components/ClientComponent/GuestHeader";
import AnimatedBackground from "../components/AnimatedBackground";

export default function ClientRoute() {
  const location = useLocation();
  const navigate = useNavigate();

  const { token, profileDetails } = useSelector(
    (state) => state?.authReducer?.AuthSlice,
  );

  const isAuthenticated = Boolean(token) && Boolean(profileDetails?._id);

  const role = profileDetails?.role;

  const searchParams = new URLSearchParams(location.search);
  const clientKey = searchParams.get("clientKey");
  const isGuest = !isAuthenticated && Boolean(clientKey);
  //   Authenticated client
  //   Client ko normal "/" chat par nahi jana chahiye.

  if (isAuthenticated && role === "client") {
    return <Navigate to="/client" replace />;
  }

  //   Authenticated normal user
  if (isAuthenticated && role === "user") {
    return <Outlet />;
  }

  // Guest
  // Guest ko clientKey ke bina chat access nahi dena.

  if (isGuest) {
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-white dark:bg-[#0b0f14]">
        {/* Guest Header */}
        <div className="shrink-0">
          <GuestHeader />
        </div>

        {/* Guest Chat Content */}
        <main className="min-h-0 flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    );
  }

  //  Not authenticated + no clientKey

  return (
    <Navigate
      to="/login"
      replace
      state={{
        from: location,
      }}
    />
  );
}
