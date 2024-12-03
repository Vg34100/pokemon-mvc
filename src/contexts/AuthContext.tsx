"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/api/api";

interface AuthContextType {
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    const res = await api.post("/login/", { username, password });
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    setUsername(username);
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await api.post("/logout/", { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and state, even if the API call fails
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUsername(null);
    }
  };

  const register = async (username: string, password: string) => {
    const res = await api.post("/register/", { username, password });
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    setUsername(username);
  };

  const checkSession = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUsername(null);
      return;
    }

    try {
      const res = await api.get("/check-session/");
      setUsername(res.data.username);
    } catch (error) {
      console.log(error)
      // If session check fails, clear everything
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUsername(null);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ username, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
