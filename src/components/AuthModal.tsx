"use client";

import React, { useState } from "react";
import { X, Mail, Lock, User, Store, Phone, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"CONSUMER" | "MERCHANT">("CONSUMER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (tab === "login") {
        await login(email, password);
      } else {
        await register({
          name,
          email,
          password,
          phone,
          role,
          businessName: role === "MERCHANT" ? businessName : undefined,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      {/* Container Modal: Dikunci dengan text-gray-900 agar tulisan selalu hitam legam */}
      <div className="bg-white text-gray-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-200 text-xs">
        {/* Header Modal */}
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
          <h3 className="font-black text-base text-gray-900">
            {tab === "login" ? "Masuk ke FoodRescue" : "Daftar Akun Baru"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Masuk / Daftar */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              setError(null);
            }}
            className={`pb-2.5 flex-1 font-bold text-xs transition ${
              tab === "login"
                ? "border-b-2 border-emerald-700 text-emerald-900"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("register");
              setError(null);
            }}
            className={`pb-2.5 flex-1 font-bold text-xs transition ${
              tab === "register"
                ? "border-b-2 border-emerald-700 text-emerald-900"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Daftar Akun
          </button>
        </div>

        {/* Notifikasi Error */}
        {error && (
          <div className="p-2.5 mb-3 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === "register" && (
            <>
              {/* Pilihan Peran: Konsumen vs Merchant */}
              <div>
                <label className="font-bold text-gray-800 block mb-1 text-[11px]">
                  Daftar Sebagai:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("CONSUMER")}
                    className={`p-2.5 border rounded-xl font-bold flex items-center gap-1.5 justify-center transition ${
                      role === "CONSUMER"
                        ? "bg-emerald-50 border-2 border-emerald-600 text-emerald-950 shadow-2xs"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <User className="w-4 h-4 text-emerald-700" />
                    <span>Konsumen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("MERCHANT")}
                    className={`p-2.5 border rounded-xl font-bold flex items-center gap-1.5 justify-center transition ${
                      role === "MERCHANT"
                        ? "bg-emerald-50 border-2 border-emerald-600 text-emerald-950 shadow-2xs"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Store className="w-4 h-4 text-emerald-700" />
                    <span>Merchant F&B</span>
                  </button>
                </div>
              </div>

              {/* Input Nama Lengkap */}
              <div>
                <label className="font-bold text-gray-900 block mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-medium"
                />
              </div>

              {/* Input Nama Toko jika Merchant */}
              {role === "MERCHANT" && (
                <div>
                  <label className="font-bold text-gray-900 block mb-1">
                    Nama Toko / Usaha F&B
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Contoh: Kopi Senja Roastery"
                    className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-medium"
                  />
                </div>
              )}

              {/* Input Nomor Telepon */}
              <div>
                <label className="font-bold text-gray-900 block mb-1">
                  Nomor WhatsApp / HP
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-medium"
                />
              </div>
            </>
          )}

          {/* Input Email */}
          <div>
            <label className="font-bold text-gray-900 block mb-1">
              Alamat Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-medium"
            />
          </div>

          {/* Input Password */}
          <div>
            <label className="font-bold text-gray-900 block mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full p-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-medium"
            />
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#144131] hover:bg-[#1a5540] text-white font-black rounded-xl mt-3 transition shadow-md disabled:opacity-50 text-xs"
          >
            {loading
              ? "Memproses..."
              : tab === "login"
                ? "Masuk Sekarang"
                : "Daftar Akun FoodRescue"}
          </button>
        </form>
      </div>
    </div>
  );
};
