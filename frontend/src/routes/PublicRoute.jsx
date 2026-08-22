// import { Navigate, Outlet } from "react-router-dom";

// import { useSelector } from "react-redux";

// export const PublicRoute = () => {
//   const { token, profileDetails } = useSelector(
//     (state) => state?.authReducer?.AuthSlice,
//   );
//   const isAuthenticated = Boolean(token) && Boolean(profileDetails?._id);
//   if (isAuthenticated) {
//     return <Navigate to="/" replace />;
//   }

//   return <Outlet />;
// };

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export const PublicRoute = () => {
  const { token, profileDetails } = useSelector(
    (state) => state?.authReducer?.AuthSlice,
  );

  const isAuthenticated =
    Boolean(token) && Boolean(profileDetails?._id);

  // User authenticated nahi hai
  if (!isAuthenticated) {
    return <Outlet />;
  }

  const userRole = profileDetails?.role;

  // ================================
  // ROLE BASED REDIRECTION
  // ================================

  if (userRole === "client") {
    return <Navigate to="/client" replace />;
  }

  if (userRole === "user") {
    return <Navigate to="/" replace />;
  }

  if (userRole === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Unknown role
  return <Navigate to="/login" replace />;
};