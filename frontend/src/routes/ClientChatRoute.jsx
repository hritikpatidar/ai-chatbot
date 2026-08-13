import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ClientChatRoute() {
  const location = useLocation();
  const { token, profileDetails } = useSelector(
    (state) => state?.authReducer?.AuthSlice,
  );

  const isAuthenticated = Boolean(token) && Boolean(profileDetails?._id);
  const searchParams = new URLSearchParams(location.search);
  const clientKey = searchParams.get("clientKey");
  const isAllowed = isAuthenticated || Boolean(clientKey);

  if (!isAllowed) {
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

  return <Outlet />;
}
