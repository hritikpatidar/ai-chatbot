import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";

export default function ClientRoute() {
  const location = useLocation();
  const { token, profileDetails } = useSelector(
    (state) => state?.authReducer?.AuthSlice,
  );
  const isAuthenticated = Boolean(token) && Boolean(profileDetails?._id);
  const isClient = profileDetails?.role === "client";
  if (!isAuthenticated) {
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
  if (!isClient) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
