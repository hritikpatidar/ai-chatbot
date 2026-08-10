import { Navigate, Outlet } from "react-router-dom";
import { isLogin } from "../utils/Auth";

export const PublicRoute = () => {
  const isToken = isLogin();
  return isToken ? <Navigate to="/" replace /> : <Outlet />;
};
