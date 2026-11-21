// src/components/MerchantLoginGate.tsx
import React, { useState } from "react";
import {
  Store,
  Lock,
  Mail,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface MerchantLoginGateProps {
  onBackToCustomer: () => void;
  onSuccess?: () => void;
  onOpenRegister?: () => void;
}

export const MerchantLoginGate: React.FC<MerchantLoginGateProps> = ({
  onBackToCustomer,
  onSuccess,
  onOpenRegister,
}) => {
  const { login, quickDemoLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Email atau kata sandi merchant salah.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setError(null);
    setLoading(true);
    try {
      await quickDemoLogin("MERCHANT_APPROVED");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Gagal login demo merchant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-200/90 p-8 space-y-6">
        {/* Header Toko */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
            <Store className="w-8 h-8 text-emerald-700" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Portal
              Mitra F&B
            </span>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Login Akun Merchant
            </h2>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Silakan login akun merchant untuk mengelola stok surplus,
              verifikasi kode pengambilan kasir, dan pantau pesanan.
            </p>
          </div>
        </div>

        {/* Notifikasi Error */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Login Toko */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Email Akun Merchant
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama.toko@foodrescue.id"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-950 font-semibold bg-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-950 font-semibold bg-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Memverifikasi..." : "Masuk ke Portal Merchant"}
          </button>
        </form>

        {/* 1-Klik Login Demo Merchant untuk Pengujian */}
        <div className="pt-2 border-t border-gray-100">
          <div className="text-center mb-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Akses Cepat Pengujian
            </span>
          </div>
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Login Demo Merchant (Marco Bakehouse)</span>
          </button>
        </div>

        {/* Tombol Kembali ke Halaman Pelanggan */}
        <div className="pt-2 flex flex-col items-center gap-2 text-xs">
          <button
            type="button"
            onClick={onBackToCustomer}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 font-semibold transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Bukan Pemilik Toko? Kembali ke Portal Pelanggan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
