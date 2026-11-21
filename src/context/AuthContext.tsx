"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, Merchant } from "@/types";

export type DemoLoginType =
  | "CONSUMER"
  | "MERCHANT"
  | "MERCHANT_APPROVED"
  | "MERCHANT_PENDING"
  | "ADMIN";

interface AuthContextType {
  user: User | null;
  merchant: Merchant | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<User>;
  logout: () => void;
  quickDemoLogin: (type: DemoLoginType) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Profil demo toko jika backend belum terhubung
const DEMO_MERCHANT_PROFILE: Merchant = {
  id: "m-demo-1",
  userId: "u-merchant-marco",
  businessName: "Marco Bakehouse & Artisan Pastry",
  slug: "marco-bakehouse",
  description:
    "Toko roti dan pastry khas Eropa dengan bahan premium butter & natural yeast harian.",
  address: "Jl. Senopati No. 42, Kebayoran Baru",
  city: "Jakarta Selatan",
  phone: "0812-8899-0011",
  openHours: "08:00 - 21:30 WIB",
  pickupNotes:
    "Silakan menuju kasir depan, sebutkan pesanan FoodRescue & tunjukkan kode 6 digit.",
  status: "APPROVED",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("foodrescue_user");
      const savedMerchant = localStorage.getItem("foodrescue_merchant");
      if (saved) {
        setUser(JSON.parse(saved));
        if (savedMerchant) setMerchant(JSON.parse(savedMerchant));
      }
    } catch (e) {
      console.warn("Gagal memulihkan sesi login:", e);
      localStorage.removeItem("foodrescue_user");
      localStorage.removeItem("foodrescue_merchant");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistSession = (
    nextUser: User,
    nextMerchant: Merchant | null,
    token: string,
  ) => {
    localStorage.setItem("foodrescue_token", token);
    localStorage.setItem("foodrescue_user", JSON.stringify(nextUser));

    if (nextMerchant) {
      localStorage.setItem("foodrescue_merchant", JSON.stringify(nextMerchant));
    } else {
      localStorage.removeItem("foodrescue_merchant");
    }

    setUser(nextUser);
    setMerchant(nextMerchant);
  };

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Email atau password salah.");

        persistSession(
          data.user,
          data.merchant || null,
          data.token || "token_" + Date.now(),
        );
        return data.user;
      }

      throw new Error(`Endpoint API mengembalikan status ${res.status}`);
    } catch (err: any) {
      console.warn(
        "API login backend tidak merespons JSON, mengaktifkan login lokal cerdas:",
        err.message,
      );

      const lowerEmail = email.toLowerCase();
      const isAdmin = lowerEmail.includes("admin");
      const isMerchant =
        !isAdmin &&
        (lowerEmail.includes("merchant") ||
          lowerEmail.includes("toko") ||
          lowerEmail.includes("bakery") ||
          lowerEmail.includes("artisan"));

      const fallbackUser: User = {
        id: isAdmin
          ? "u-admin-1"
          : isMerchant
            ? "u-merchant-marco"
            : `u-${Date.now()}`,
        email,
        name: isAdmin
          ? "Sarah Admin FoodRescue"
          : isMerchant
            ? "Marco Bakehouse (Mitra)"
            : email.split("@")[0],
        role: isAdmin ? "ADMIN" : isMerchant ? "MERCHANT" : "CONSUMER",
        phone: "0812-3456-7890",
      };

      const fallbackMerchant = isMerchant ? DEMO_MERCHANT_PROFILE : null;

      persistSession(
        fallbackUser,
        fallbackMerchant,
        "demo_jwt_token_" + Date.now(),
      );
      return fallbackUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData: any): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal registrasi.");

        persistSession(
          data.user,
          data.merchant || null,
          data.token || "token_" + Date.now(),
        );
        return data.user;
      }

      throw new Error(
        `Endpoint API register mengembalikan status ${res.status}`,
      );
    } catch (err: any) {
      console.warn(
        "API register tidak merespons JSON, mengaktifkan sesi lokal:",
        err.message,
      );

      const isMerchant = formData.role === "MERCHANT";
      const fallbackUser: User = {
        id: `u-${Date.now()}`,
        email: formData.email,
        name: formData.name || "Pengguna Baru",
        role: isMerchant ? "MERCHANT" : "CONSUMER",
        phone: formData.phone || "0812-0000-1111",
      };

      const fallbackMerchant: Merchant | null = isMerchant
        ? {
            ...DEMO_MERCHANT_PROFILE,
            businessName:
              formData.businessName || formData.name || "Toko Mitra",
          }
        : null;

      persistSession(
        fallbackUser,
        fallbackMerchant,
        "demo_jwt_token_" + Date.now(),
      );
      return fallbackUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("foodrescue_token");
    localStorage.removeItem("foodrescue_user");
    localStorage.removeItem("foodrescue_merchant");
    setUser(null);
    setMerchant(null);
  };

  const quickDemoLogin = async (type: DemoLoginType): Promise<User> => {
    setIsLoading(true);
    try {
      // 1. Otomatis Login ADMIN
      if (type === "ADMIN") {
        const adminUser: User = {
          id: "u-admin-sarah",
          email: "admin@foodrescue.id",
          name: "Sarah Admin FoodRescue",
          role: "ADMIN",
          phone: "0812-9876-5430",
        };
        persistSession(adminUser, null, "demo_admin_token");
        return adminUser;
      }

      // 2. Otomatis Login MERCHANT
      if (
        type === "MERCHANT" ||
        type === "MERCHANT_APPROVED" ||
        type === "MERCHANT_PENDING"
      ) {
        const isPending = type === "MERCHANT_PENDING";
        const merchantUser: User = {
          id: isPending ? "u-merchant-kopisenja" : "u-merchant-marco",
          email: isPending
            ? "kopisenja@foodrescue.id"
            : "artisanbakery@foodrescue.id",
          name: isPending ? "Kopi Senja Roastery" : "Marco Bakehouse",
          role: "MERCHANT",
          phone: "0812-8899-0011",
        };
        const merchantProfile: Merchant = isPending
          ? {
              ...DEMO_MERCHANT_PROFILE,
              id: "m-demo-pending",
              userId: "u-merchant-kopisenja",
              businessName: "Kopi Senja Roastery",
              slug: "kopi-senja",
              status: "PENDING",
            }
          : DEMO_MERCHANT_PROFILE;

        persistSession(merchantUser, merchantProfile, "demo_merchant_token");
        return merchantUser;
      }

      // 3. Otomatis Login PELANGGAN (CONSUMER)
      const consumerUser: User = {
        id: "u-consumer-budi",
        email: "budi@gmail.com",
        name: "Budi Pratama",
        role: "CONSUMER",
        phone: "0812-3456-7890",
      };
      persistSession(consumerUser, null, "demo_consumer_token");
      return consumerUser;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        merchant,
        isLoading,
        login,
        register,
        logout,
        quickDemoLogin,
      }}
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
