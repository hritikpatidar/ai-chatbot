import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import GuestHeader from "../components/ClientComponent/GuestHeader";

export default function ClientRoute() {
  const location = useLocation();

  const { token, profileDetails } = useSelector(
    (state) => state?.authReducer?.AuthSlice,
  );

  const isAuthenticated = Boolean(token) && Boolean(profileDetails?._id);

  const role = profileDetails?.role;

  const searchParams = new URLSearchParams(location.search);
  const clientKey = searchParams.get("clientKey");

  const isGuest = !isAuthenticated && Boolean(clientKey);

  // Authenticated client
  if (isAuthenticated && role === "client") {
    return <Navigate to="/client" replace />;
  }

  // Authenticated normal user
  if (isAuthenticated && role === "user") {
    return <Outlet />;
  }

  // Guest
  if (isGuest) {
    return (
      <div className="flex h-screen min-h-0 flex-col overflow-hidden bg-white dark:bg-[#0b0f14]">
        {/* Guest Header */}
        <div className="shrink-0">
          <GuestHeader />
        </div>

        {/* Guest Chat Content */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    );
  }
  // Not authenticated + no clientKey
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
