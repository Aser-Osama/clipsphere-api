import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      Cookies.remove("token");
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    // Enhance error with a user-friendly message for contextual display
    const body = error.response?.data;
    if (body?.message) {
      error.message = body.message;
    } else if (status === 403) {
      error.message = "You don't have permission to do that.";
    } else if (status === 409) {
      error.message = "This action has already been performed.";
    } else if (status === 400) {
      error.message = "Invalid request. Please check your input.";
    } else if (status && status >= 500) {
      error.message = "Something went wrong on our end. Please try again.";
    }

    return Promise.reject(error);
  }
);

export default api;
