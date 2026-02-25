"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { fetcher } from "@/lib/fetcher";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =============================
  // Fetch Profile
  // =============================
  const fetchProfile = async () => {
    try {
      const data = await fetcher("/api/auth/profile");

      setUser({
        adminId: data.adminId,
      });
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // On Mount
  // =============================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // =============================
  // Login
  // =============================
  const login = async (token) => {
    localStorage.setItem("token", token);
    await fetchProfile();
  };

  // =============================
  // Logout
  // =============================
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);