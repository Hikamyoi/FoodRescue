"use client";

import React, { useState } from "react";
import {
  Leaf,
  ShoppingBag,
  User as UserIcon,
  Store,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Clock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export interface NavbarCustomerProps {
  activeMenu?: string;
  cartCount?: number;
  onNavigate?: (view: string) => void;
  onOpenCart?: () => void;
  onLoginClick?: () => void;
}

export const NavbarCustomer: React.FC<NavbarCustomerProps> = ({
  activeMenu = "home",
  cartCount = 2,
  onNavigate = () => {},
  onOpenCart = () => {},
  onLoginClick = () => {},
}) => {
  // ⭐️ Ambil data user & fungsi logout dari AuthContext
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const customerLinks = [
    { id: "home", label: "Beranda" },
    { id: "catalog", label: "Katalog Surplus" },
    { id: "orders", label: "Riwayat Pesanan" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#144131] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 1. Logo Brand Pelanggan */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2 group text-left focus:outline-none cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Leaf className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                  Food<span className="text-emerald-400">Rescue</span>
                </span>
                <span className="block text-[10px] text-emerald-200/80 -mt-1 tracking-wider uppercase font-medium">
                  Selamatkan Makanan, Hemat Lebih
                </span>
              </div>
            </button>

            {/* Navigasi Desktop */}
            <nav className="hidden md:flex items-center ml-8 space-x-1">
              {customerLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    activeMenu === link.id
                      ? "bg-emerald-800 text-white shadow-sm"
                      : "text-emerald-100/90 hover:bg-emerald-800/50 hover:text-white"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 2. Sisi Kanan: Keranjang & Profil / Tombol Masuk */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Tombol Keranjang Belanja */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-emerald-800/50 hover:bg-emerald-800 text-white border border-emerald-700/50 transition flex items-center gap-2 cursor-pointer"
              aria-label="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5 text-emerald-300" />
              <span className="hidden sm:inline text-xs font-semibold">
                Keranjang
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-400 text-emerald-950 text-xs font-black rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* 3. LOGIKA KONDISIONAL: SUDAH LOGIN vs BELUM LOGIN */}
            {user ? (
              // ✅ JIKA SUDAH LOGIN: Tampilkan Avatar Inisial + Nama + Dropdown Logout
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 border border-emerald-700/60 text-white transition text-xs cursor-pointer shadow-sm"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-emerald-950 flex items-center justify-center font-black text-xs shadow-inner">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="hidden sm:inline font-bold max-w-[120px] truncate text-emerald-50">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
                </button>

                {/* Dropdown Menu Saat Avatar Diklik */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 text-xs animate-scale-in">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-bold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-gray-500 truncate text-[11px]">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {user.role === "MERCHANT"
                          ? "Mitra Toko"
                          : "Pelanggan Aktif"}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate("orders");
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-emerald-50 flex items-center gap-2 font-medium text-gray-700 cursor-pointer"
                    >
                      <Clock className="w-4 h-4 text-emerald-600" />
                      Riwayat Pesanan Saya
                    </button>

                    <button
                      onClick={() => {
                        onNavigate("merchant-portal");
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-emerald-50 flex items-center gap-2 font-semibold text-emerald-700 cursor-pointer"
                    >
                      <Store className="w-4 h-4 text-emerald-600" />
                      Buka Portal Merchant
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>

                    {/* Tombol Logout */}
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar (Logout)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // ❌ JIKA BELUM LOGIN: Tampilkan Tombol "Masuk"
              <button
                onClick={onLoginClick}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>Masuk</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl bg-emerald-800/50 text-white hover:bg-emerald-800 cursor-pointer"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-emerald-800/80 bg-[#12382a] px-4 pt-3 pb-5 space-y-2">
          {customerLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setIsMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeMenu === link.id
                  ? "bg-emerald-700 text-white"
                  : "text-emerald-100 hover:bg-emerald-800/60"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
