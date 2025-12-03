export const getApiUrl = () => {
  if (import.meta.env.DEV) {
    return ""; 
  }
  return import.meta.env.VITE_API_URL || "";
};