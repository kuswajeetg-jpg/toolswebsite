"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin123";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem("adminAuth");
    if (authStatus === "authenticated") {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const storedUsername = localStorage.getItem("adminUsername") || DEFAULT_USERNAME;
    const storedPassword = localStorage.getItem("adminPassword") || DEFAULT_PASSWORD;

    if (username === storedUsername && password === storedPassword) {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuth", "authenticated");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuth");
  };

  const changePassword = (currentPassword: string, newPassword: string): boolean => {
    const storedPassword = localStorage.getItem("adminPassword") || DEFAULT_PASSWORD;

    if (currentPassword !== storedPassword) {
      return false;
    }

    localStorage.setItem("adminPassword", newPassword);
    return true;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}