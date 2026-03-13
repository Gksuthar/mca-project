export const baseApiURL = () => {
  return import.meta.env.VITE_API_URL || "http://localhost:4000/api";
};

export const baseMediaURL = () => {
  return import.meta.env.VITE_MEDIA_URL || "http://localhost:4000/media";
};

