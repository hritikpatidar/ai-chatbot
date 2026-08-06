import { getItemLocalStorage } from "./utils/browserServices";

const getUrl = () => {
  const userRole = getItemLocalStorage("userRole") || "Guest";
  const API_BASE_URLS = {
    Seller: "seller",
    Admin: "super-admin",
    Guest: "auth"
  };
  return API_BASE_URLS[userRole];
};

export default getUrl;
