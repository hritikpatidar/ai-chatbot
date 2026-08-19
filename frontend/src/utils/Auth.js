import {
  getItemLocalStorage,
  setItemLocalStorage,
} from "../utils/browserServices";

export const isLogin = () => {
  const token = getItemLocalStorage("token");
  if (token) return true;
  else return false;
};

export const getGuestId = (clientKey) => {
  if (!clientKey) return null;
  const storageKey = `guestId:${clientKey}`;
  let guestId = getItemLocalStorage(storageKey);

  if (!guestId) {
    guestId = crypto.randomUUID();
    setItemLocalStorage(storageKey, guestId);
  }

  return guestId;
};


export const detectURLs = (message) => {
  if (!message) return [];
  const cleanedMessage = message.replace(/[\n\s]+$/g, "");
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return cleanedMessage.split(urlRegex);
};

export const isValidURL = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const checkIfImage = (filePath) => {
  const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico|heic|heif||jfif)$/i;
  return imageRegex.test(filePath);
};

export const isLink = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  return urlRegex.test(text);
};

export const base64ToFile = (base64Data, fileName) => {
  const arr = base64Data.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
};

// export const currencyLogo = "SAR"
export const currencyLogo = "⃁";
