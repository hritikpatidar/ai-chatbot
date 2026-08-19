import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ClientRoute() {
  const location = useLocation();

  const { token, profileDetails } = useSelector(
    (state) => state?.authReducer?.AuthSlice,
  );

  const isAuthenticated = Boolean(token) && Boolean(profileDetails?._id);

  const role = profileDetails?.role;

  const searchParams = new URLSearchParams(location.search);
  const clientKey = searchParams.get("clientKey");

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

  if (!isAuthenticated && clientKey) {
    return <Outlet />;
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
