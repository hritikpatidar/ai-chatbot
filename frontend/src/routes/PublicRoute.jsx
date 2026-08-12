import { Navigate, Outlet } from "react-router-dom";

import { useSelector } from "react-redux";

export const PublicRoute = () => {
  const { token, profileDetails } = useSelector(
    (state) => state?.authReducer?.AuthSlice,
  );
  const isAuthenticated = Boolean(token) && Boolean(profileDetails?._id);
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
