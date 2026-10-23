"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, Merchant } from "@/types";

interface AuthContextType {
  user: User | null;
  merchant: Merchant | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  quickDemoLogin: (
    type: "CONSUMER" | "MERCHANT_APPROVED" | "MERCHANT_PENDING" | "ADMIN",
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [merchant, setMerchant] = useState<Merchant | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("foodrescue_user");
    const savedMerchant = localStorage.getItem("foodrescue_merchant");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
        if (savedMerchant) setMerchant(JSON.parse(savedMerchant));
      } catch {}
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal login.");

    localStorage.setItem("foodrescue_token", data.token);
    localStorage.setItem("foodrescue_user", JSON.stringify(data.user));
    if (data.merchant)
      localStorage.setItem(
        "foodrescue_merchant",
        JSON.stringify(data.merchant),
      );

    setUser(data.user);
    setMerchant(data.merchant || null);
  };

  const register = async (formData: any) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal registrasi.");

    localStorage.setItem("foodrescue_token", data.token);
    localStorage.setItem("foodrescue_user", JSON.stringify(data.user));
    if (data.merchant)
      localStorage.setItem(
        "foodrescue_merchant",
        JSON.stringify(data.merchant),
      );

    setUser(data.user);
    setMerchant(data.merchant || null);
  };

  const logout = () => {
    localStorage.removeItem("foodrescue_token");
    localStorage.removeItem("foodrescue_user");
    localStorage.removeItem("foodrescue_merchant");
    setUser(null);
    setMerchant(null);
  };

  const quickDemoLogin = async (
    type: "CONSUMER" | "MERCHANT_APPROVED" | "MERCHANT_PENDING" | "ADMIN",
  ) => {
    let email = "budi@gmail.com";
    if (type === "MERCHANT_APPROVED") email = "artisanbakery@foodrescue.id";
    if (type === "MERCHANT_PENDING") email = "kopisenja@foodrescue.id";
    if (type === "ADMIN") email = "admin@foodrescue.id";
    await login(email, "password123");
  };

  return (
    <AuthContext.Provider
      value={{ user, merchant, login, register, logout, quickDemoLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus digunakan di dalam AuthProvider");
  return ctx;
}
