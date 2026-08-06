import { Navigate, Outlet } from "react-router-dom";
import { isLogin } from "../utils/Auth";

export const PrivateRoute = () => {
  const isToken = isLogin();
  return isToken ? <Outlet /> : <Navigate to="/login" replace />;
};
