import { Navigate, Outlet } from "react-router-dom";
import { isLogin } from "../Utils/Auth";

export const PublicRoute = () => {
  const isToken = isLogin();
  return isToken ? <Navigate to="/" replace /> : <Outlet />;
};
