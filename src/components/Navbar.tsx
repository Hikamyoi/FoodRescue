import React, { useState } from "react";
import {
  Leaf,
  ShoppingBag,
  User as UserIcon,
  Store,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Clock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, extra?: any) => void;
  onOpenAuth: () => void;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
  onOpenCart,
}) => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Navigasi utama yang ringkas
  const navLinks = [
    { id: "home", label: "Beranda" },
    { id: "catalog", label: "Katalog Surplus" },
    { id: "merchant-portal", label: "Portal Merchant" },
    { id: "orders", label: "Riwayat Pesanan" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#144131] text-white shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center ml-8 space-x-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    currentView === link.id
                      ? "bg-emerald-800/80 text-white shadow-sm"
                      : "text-emerald-100/90 hover:bg-emerald-800/50 hover:text-white"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Action Icons & User Menus */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-emerald-800/50 hover:bg-emerald-800 text-white border border-emerald-700/50 transition-all flex items-center gap-2 cursor-pointer"
              aria-label="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5 text-emerald-300" />
              <span className="hidden sm:inline text-xs font-medium">
                Keranjang
              </span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-emerald-400 text-[#144131] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account / Login Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 border border-emerald-700/50 text-white text-xs font-medium transition cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate hidden sm:inline">
                    {user.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-700 font-semibold text-emerald-200">
                    {user.role}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white text-gray-800 shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Peran: {user.role}
                      </span>
                    </div>

                    {user.role === "CONSUMER" && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate("orders");
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2 cursor-pointer"
                      >
                        <Clock className="w-4 h-4 text-emerald-600" />
                        Pesanan Saya
                      </button>
                    )}

                    {user.role === "MERCHANT" && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate("merchant-portal");
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2 cursor-pointer"
                      >
                        <Store className="w-4 h-4 text-emerald-600" />
                        Dashboard Toko Merchant
                      </button>
                    )}

                    {user.role === "ADMIN" && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate("admin-portal");
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Dashboard Administrator
                      </button>
                    )}

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar (Logout)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#144131] text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                Masuk / Daftar
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/60 cursor-pointer"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#113729] border-t border-emerald-900 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setIsMenuOpen(false);
                onNavigate(link.id);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                currentView === link.id
                  ? "bg-emerald-800 text-white font-semibold"
                  : "text-emerald-100 hover:bg-emerald-800/50"
              }`}
            >
              {link.label}
            </button>
          ))}

          {user?.role === "CONSUMER" && (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onNavigate("orders");
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-100 hover:bg-emerald-800/50"
            >
              Riwayat Pesanan Saya
            </button>
          )}

          {user?.role === "MERCHANT" && (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onNavigate("merchant-portal");
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-200 bg-emerald-900/60 flex items-center gap-2"
            >
              <Store className="w-4 h-4" />
              Buka Dashboard Merchant
            </button>
          )}

          {user?.role === "ADMIN" && (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onNavigate("admin-portal");
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-200 bg-emerald-900/60 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Buka Dashboard Admin
            </button>
          )}
        </div>
      )}
    </header>
  );
};
