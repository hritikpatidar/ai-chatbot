import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const PrivateRoute = ({ allowedRoles = [] }) => {
  const location = useLocation();

  const { token, profileDetails } = useSelector(
    (state) => state?.authReducer?.AuthSlice,
  );

  const isAuthenticated = Boolean(token) && Boolean(profileDetails?._id);

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

  const userRole = profileDetails?.role;
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    if (userRole === "client") {
      return <Navigate to="/client" replace />;
    }

    if (userRole === "user") {
      return <Navigate to="/" replace />;
    }

    if (userRole === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
