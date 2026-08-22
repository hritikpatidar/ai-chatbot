export const getImageUrl = (image, fallback) => {
  if (!image) return fallback;

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("blob:")
  ) {
    return image;
  }

  return `${import.meta.env.VITE_SOCKET_URL}${image}`;
};