"use client";

import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001"; // change if needed

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

    return response.data;
  } catch (error) {
    const status = error.response?.status;

    // 🔥 Auto logout on 401
    if (status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data ||
      error.message;

    throw new Error(errorMessage);
  }
};