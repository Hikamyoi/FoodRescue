"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Store,
  Users,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Search,
  Filter,
} from "lucide-react";
import { Merchant, Product, Order, PlatformStats } from "@/types";

// Data awal demo untuk admin jika backend belum terisi
const INITIAL_STATS: PlatformStats = {
  totalMerchants: 12,
  pendingMerchants: 2,
  totalProductsListed: 84,
  totalConsumers: 480,
  totalOrders: 156,
  totalFoodRescuedPortions: 342,
  co2SavedKg: 855,
  totalMoneySavedIdr: 8650000,
};

const INITIAL_MERCHANTS: Merchant[] = [
  {
    id: "m-1",
    userId: "u-1",
    businessName: "Marco Bakehouse & Artisan Pastry",
    slug: "marco-bakehouse",
    description:
      "Toko roti dan pastry khas Eropa dengan butter premium & natural yeast.",
    address: "Jl. Senopati No. 42, Kebayoran Baru",
    city: "Jakarta Selatan",
    phone: "0812-8899-0011",
    openHours: "08:00 - 21:30 WIB",
    pickupNotes:
      "Sebutkan FoodRescue dan tunjukkan kode 6-digit ke kasir depan.",
    status: "APPROVED",
  },
  {
    id: "m-2",
    userId: "u-2",
    businessName: "Kopi & Kudapan Senja",
    slug: "kopi-senja",
    description:
      "Kafe artisanal dengan aneka pastry, cake potong, dan bento bowl sehat.",
    address: "Jl. Kemang Raya No. 18",
    city: "Jakarta Selatan",
    phone: "0856-1122-3344",
    openHours: "09:00 - 22:00 WIB",
    pickupNotes: "Pengambilan di bar kasir lantai 1.",
    status: "APPROVED",
  },
  {
    id: "m-pending-1",
    userId: "u-p1",
    businessName: "Dapur Nasi Nusantara Menteng",
    slug: "dapur-nusantara",
    description:
      "Resto masakan khas Nusantara harian dengan kelebihan lauk pauk siap santap sore.",
    address: "Jl. Teuku Cik Ditiro No. 12, Menteng",
    city: "Jakarta Pusat",
    phone: "0813-9988-7766",
    openHours: "10:00 - 21:00 WIB",
    pickupNotes: "Masuk area kasir samping.",
    status: "PENDING",
  },
  {
    id: "m-pending-2",
    userId: "u-p2",
    businessName: "Boulangerie Parisienne BSD",
    slug: "boulangerie-bsd",
    description:
      "Bakery artisanal Perancis penyedia baguette, croissant, dan sandwich.",
    address: "Ruko Breeze BSD City Blok B-05",
    city: "Tangerang Selatan",
    phone: "0821-4455-6677",
    openHours: "08:00 - 20:30 WIB",
    pickupNotes: "Tunjukkan kode ke staf kasir bakery.",
    status: "PENDING",
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"merchants" | "stats">(
    "merchants",
  );
  const [stats, setStats] = useState<PlatformStats>(INITIAL_STATS);
  const [merchants, setMerchants] = useState<Merchant[]>(INITIAL_MERCHANTS);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Modal Penolakan
  const [rejectionModalMerchant, setRejectionModalMerchant] =
    useState<Merchant | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleVerify = (
    id: string,
    newStatus: "APPROVED" | "REJECTED",
    note?: string,
  ) => {
    setMerchants((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: newStatus, rejectionNote: note || m.rejectionNote }
          : m,
      ),
    );

    if (newStatus === "APPROVED") {
      setStats((s) => ({
        ...s,
        totalMerchants: s.totalMerchants + 1,
        pendingMerchants: Math.max(0, s.pendingMerchants - 1),
      }));
      setActionMessage("Mitra toko berhasil disetujui & aktif di katalog!");
    } else {
      setStats((s) => ({
        ...s,
        pendingMerchants: Math.max(0, s.pendingMerchants - 1),
      }));
      setActionMessage("Pendaftaran mitra telah ditolak.");
    }

    setRejectionModalMerchant(null);
    setRejectionNote("");
    setTimeout(() => setActionMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header Bar */}
      <header className="bg-[#144131] text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white text-xs font-bold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ke Halaman Utama</span>
            </Link>
            <div className="h-4 w-px bg-emerald-700 mx-1"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="font-black text-sm tracking-tight text-white">
                Admin <span className="text-emerald-400">Control Hub</span>
              </span>
            </div>
          </div>

          <span className="text-xs bg-emerald-950 px-3 py-1 rounded-full text-emerald-300 font-bold border border-emerald-800">
            Superadmin Mode
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Banner Alert Sukses */}
        {actionMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Ringkasan Metrik Platform */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs font-bold text-gray-500">
              Merchant Terverifikasi
            </span>
            <div className="text-2xl font-black text-[#144131] mt-1">
              {stats.totalMerchants} Toko
            </div>
            <span className="text-[11px] font-bold text-amber-600">
              {merchants.filter((m) => m.status === "PENDING").length} menunggu
              verifikasi
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs font-bold text-gray-500">
              Porsi Diselamatkan
            </span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {stats.totalFoodRescuedPortions} Porsi
            </div>
            <span className="text-[11px] font-medium text-gray-500">
              Dari seluruh transaksi
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs font-bold text-gray-500">
              Emisi Karbon Dicegah
            </span>
            <div className="text-2xl font-black text-emerald-700 mt-1">
              {stats.co2SavedKg} kg CO2e
            </div>
            <span className="text-[11px] font-medium text-emerald-600">
              Dampak nyata lingkungan
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs font-bold text-gray-500">
              Total Penghematan
            </span>
            <div className="text-xl font-black text-[#144131] mt-1 truncate">
              {formatRupiah(stats.totalMoneySavedIdr)}
            </div>
            <span className="text-[11px] font-medium text-gray-500">
              Bagi para konsumen
            </span>
          </div>
        </div>

        {/* Tabel Verifikasi Toko / Merchant */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-gray-900">
                Persetujuan & Verifikasi Mitra Toko F&B
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Pastikan identitas, alamat, dan izin usaha kuliner memenuhi
                standar higienis.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Total: {merchants.length} Toko
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {merchants.map((m) => (
              <div
                key={m.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm text-gray-900">
                      {m.businessName}
                    </h3>
                    {m.status === "APPROVED" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Disetujui (Aktif)
                      </span>
                    )}
                    {m.status === "PENDING" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse">
                        Menunggu Persetujuan
                      </span>
                    )}
                    {m.status === "REJECTED" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        Ditolak
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 max-w-2xl leading-relaxed">
                    {m.description}
                  </p>

                  <div className="text-[11px] text-gray-500 flex flex-wrap gap-x-4 gap-y-1 pt-1 font-medium">
                    <span>
                      📍 {m.address}, {m.city}
                    </span>
                    <span>📞 {m.phone}</span>
                    <span>⏰ {m.openHours}</span>
                  </div>

                  {m.rejectionNote && (
                    <div className="text-[11px] text-rose-600 font-semibold pt-1">
                      Catatan Penolakan: "{m.rejectionNote}"
                    </div>
                  )}
                </div>

                {/* Tombol Aksi Verifikasi */}
                <div className="flex items-center gap-2 shrink-0">
                  {m.status !== "APPROVED" && (
                    <button
                      onClick={() => handleVerify(m.id, "APPROVED")}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Setujui
                    </button>
                  )}

                  {m.status !== "REJECTED" && (
                    <button
                      onClick={() => {
                        setRejectionModalMerchant(m);
                        setRejectionNote("");
                      }}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Tolak
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal Alasan Penolakan */}
      {rejectionModalMerchant && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4">
            <h3 className="text-base font-black text-gray-900">
              Tolak Pendaftaran {rejectionModalMerchant.businessName}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Tuliskan alasan penolakan agar mitra dapat memperbaiki dokumen
              atau ketentuan usahanya:
            </p>
            <textarea
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              placeholder="Contoh: Dokumen izin edar pangan belum lengkap atau jam operasional tidak sesuai..."
              rows={3}
              className="w-full p-3 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none text-gray-900"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectionModalMerchant(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() =>
                  handleVerify(
                    rejectionModalMerchant.id,
                    "REJECTED",
                    rejectionNote,
                  )
                }
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm cursor-pointer"
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
