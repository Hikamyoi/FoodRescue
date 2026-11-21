"use client";

import React, { useState } from "react";
import {
  Store,
  ArrowLeft,
  CheckCircle2,
  ShoppingBag,
  Package,
  Layers,
  Menu,
  X,
} from "lucide-react";

export type MerchantTab = "orders" | "products" | "profile";

interface NavbarMerchantProps {
  storeName?: string;
  activeTab?: MerchantTab;
  pendingOrdersCount?: number;
  onTabChange?: (tab: MerchantTab) => void;
  onAddProductClick?: () => void; // Opsional agar kompatibel jika masih dipanggil di page.tsx
  onBackToCustomer?: () => void;
}

export const NavbarMerchant: React.FC<NavbarMerchantProps> = ({
  storeName = "Marco Bakehouse & Artisan Pastry",
  activeTab = "orders",
  pendingOrdersCount = 2,
  onTabChange = () => {},
  onBackToCustomer = () => {},
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs: Array<{
    id: MerchantTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: "orders", label: "Pesanan Masuk", icon: ShoppingBag },
    { id: "products", label: "Katalog Surplus Toko", icon: Package },
    { id: "profile", label: "Profil & Petunjuk Kasir", icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c281e] text-white border-b border-emerald-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 1. LOGO & IDENTITAS TOKO */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-emerald-950 flex items-center justify-center font-black shadow-md shadow-emerald-500/20">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold tracking-tight text-white">
                    {storeName}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Mitra
                    Resmi
                  </span>
                </div>
                <span className="text-[11px] text-emerald-300/80 block font-medium">
                  Portal Kasir &amp; Operasional Mitra
                </span>
              </div>
            </div>

            {/* 2. MENU NAVIGASI DASHBOARD TOKO (DESKTOP) */}
            <nav className="hidden lg:flex items-center ml-6 pl-6 border-l border-emerald-800/80 space-x-1 text-xs">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange(tab.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-emerald-800 text-white shadow-sm"
                        : "text-emerald-200/80 hover:bg-emerald-900/60 hover:text-white"
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.id === "orders" && pendingOrdersCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 bg-amber-400 text-amber-950 font-black rounded-full text-[10px]">
                        {pendingOrdersCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* 3. SISI KANAN: MODE PELANGGAN & MENU MOBILE */}
          <div className="flex items-center gap-2.5">
            {/* Tombol Keluar ke Mode Pelanggan */}
            <button
              type="button"
              onClick={onBackToCustomer}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/60 text-emerald-200 hover:text-white text-xs font-semibold transition cursor-pointer whitespace-nowrap"
              title="Kembali ke Halaman Web Pelanggan"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mode Pelanggan</span>
            </button>

            {/* Hamburger Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-emerald-900/60 text-white lg:hidden cursor-pointer"
              aria-label="Toggle Menu Toko"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4. MENU MOBILE DROPDOWN */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-emerald-900 bg-[#091f17] px-4 py-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                onTabChange(tab.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                activeTab === tab.id
                  ? "bg-emerald-800 text-white"
                  : "text-emerald-200/80 hover:bg-emerald-900/50"
              }`}
            >
              <span>{tab.label}</span>
              {tab.id === "orders" && pendingOrdersCount > 0 && (
                <span className="px-1.5 py-0.5 bg-amber-400 text-amber-950 font-black rounded-full text-[10px]">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
