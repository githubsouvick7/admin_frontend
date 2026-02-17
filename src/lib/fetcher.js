"use client";

import axios from "axios";

const BASE_URL = "http://localhost:5000";

export const fetcher = async (
  endpoint,
  method = "GET",
  data = null,
  headers = {}
) => {
  try {
    const url = `${BASE_URL}${endpoint}`;
    const defaultHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      ...headers,
    };

    const config = {
      method,
      url,
      headers: defaultHeaders,
      ...(data && { data }),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.log("API Call Error:", error);

    const errorMessage =
      error.response?.data?.message || error.response?.data || error.message;
    throw new Error(errorMessage);
  }
};
