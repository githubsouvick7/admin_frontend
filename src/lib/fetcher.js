"use client";
import axios from "axios";

const BASE_URL =
  "https://api-smart-mobile-service.onrender.com";

export const fetcher = async (
  endpoint,
  method = "GET",
  data = null,
  customHeaders = {}
) => {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    const response = await axios({
      url: `${BASE_URL}${endpoint}`,
      method,
      data,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...customHeaders,
      },
    });

    return response.data; // { success, data }
  } catch (error) {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    throw new Error(
      error.response?.data?.message || error.message
    );
  }
};