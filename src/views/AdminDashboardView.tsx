"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Store,
  Users,
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Search,
  Check,
  X,
  Filter,
  ArrowUpRight,
  Leaf,
  Layers,
} from "lucide-react";

// Tipe Data untuk Dashboard Admin
interface AdminStore {
  id: string;
  name: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  productsCount: number;
  createdAt: string;
}

interface AdminProduct {
  id: string;
  storeName: string;
  title: string;
  category: string;
  originalPrice: number;
  discountPrice: number;
  stock: number;
  isActive: boolean;
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  storeName: string;
  totalAmount: number;
  pickupCode: string;
  status:
    | "PENDING_CONFIRMATION"
    | "CONFIRMED"
    | "READY_FOR_PICKUP"
    | "COMPLETED"
    | "CANCELLED";
  createdAt: string;
}

// Data Contoh Siap Pakai (Mock Data)
const INITIAL_STORES: AdminStore[] = [
  {
    id: "store-1",
    name: "Kopi & Kudapan Senja",
    ownerName: "Reza Rahardian",
    email: "kopisenja@foodrescue.id",
    phone: "0812-4455-6677",
    address: "Jl. Kemang Raya No. 18",
    city: "Jakarta Selatan",
    verificationStatus: "PENDING",
    productsCount: 3,
    createdAt: "Hari ini, 09:30 WIB",
  },
  {
    id: "store-2",
    name: "Marco Bakehouse & Artisan Pastry",
    ownerName: "Marco Silalahi",
    email: "artisanbakery@foodrescue.id",
    phone: "0812-8899-0011",
    address: "Jl. Senopati No. 42",
    city: "Jakarta Selatan",
    verificationStatus: "APPROVED",
    productsCount: 4,
    createdAt: "2 hari lalu",
  },
  {
    id: "store-3",
    name: "Warung Bento Sakura",
    ownerName: "Kenjiro Tanaka",
    email: "bentosakura@foodrescue.id",
    phone: "0856-1122-3344",
    address: "Ruko Gandaria Blok B-3",
    city: "Jakarta Selatan",
    verificationStatus: "REJECTED",
    productsCount: 0,
    createdAt: "5 hari lalu",
  },
];

const INITIAL_PRODUCTS: AdminProduct[] = [
  {
    id: "p-1",
    storeName: "Marco Bakehouse",
    title: "Butter Croissant Premium Box (Isi 2)",
    category: "Bakery",
    originalPrice: 40000,
    discountPrice: 20000,
    stock: 5,
    isActive: true,
  },
  {
    id: "p-2",
    storeName: "Marco Bakehouse",
    title: "Artisan Country Sourdough Loaf (500g)",
    category: "Bakery",
    originalPrice: 65000,
    discountPrice: 35000,
    stock: 2,
    isActive: true,
  },
  {
    id: "p-3",
    storeName: "Kopi & Kudapan Senja",
    title: "Cold Brew Arabica & Cinnamon Roll Combo",
    category: "Beverages",
    originalPrice: 50000,
    discountPrice: 25000,
    stock: 4,
    isActive: true,
  },
];

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: "ord-1",
    orderNumber: "FR-9042",
    customerName: "Budi Santoso",
    storeName: "Marco Bakehouse",
    totalAmount: 38000,
    pickupCode: "849102",
    status: "READY_FOR_PICKUP",
    createdAt: "10 menit lalu",
  },
  {
    id: "ord-2",
    orderNumber: "FR-8731",
    customerName: "Siti Rahma",
    storeName: "Kopi & Kudapan Senja",
    totalAmount: 29000,
    pickupCode: "512930",
    status: "COMPLETED",
    createdAt: "1 jam lalu",
  },
];

export const AdminDashboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "stores" | "products" | "orders"
  >("overview");

  // State Manajemen Data
  const [stores, setStores] = useState<AdminStore[]>(INITIAL_STORES);
  const [products, setProducts] = useState<AdminProduct[]>(INITIAL_PRODUCTS);
  const [orders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Alasan Penolakan
  const [rejectingStore, setRejectingStore] = useState<AdminStore | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Aksi Verifikasi Toko
  const handleApproveStore = (storeId: string) => {
    setStores((prev) =>
      prev.map((s) =>
        s.id === storeId ? { ...s, verificationStatus: "APPROVED" } : s,
      ),
    );
    showToast("Toko berhasil diverifikasi dan aktif menerima pesanan!");
  };

  const handleRejectStore = () => {
    if (!rejectingStore) return;
    setStores((prev) =>
      prev.map((s) =>
        s.id === rejectingStore.id
          ? { ...s, verificationStatus: "REJECTED" }
          : s,
      ),
    );
    setRejectingStore(null);
    setRejectReason("");
    showToast("Toko telah ditolak dari daftar mitra.");
  };

  // Aksi Toggle Aktif Produk
  const handleToggleProduct = (prodId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === prodId ? { ...p, isActive: !p.isActive } : p)),
    );
    showToast("Status tayang produk berhasil diubah.");
  };

  const pendingStoresCount = stores.filter(
    (s) => s.verificationStatus === "PENDING",
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-gray-900">
      {/* 1. Header Admin */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0c281e] text-emerald-400 flex items-center justify-center font-black shadow-md">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Pusat Kontrol Administrator
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Audit operasional, verifikasi mitra F&B, dan kontrol kualitas
              makanan surplus FoodRescue.
            </p>
          </div>
        </div>

        {/* Notifikasi Cepat Toko Tertunda */}
        {pendingStoresCount > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold animate-pulse">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>
              Ada {pendingStoresCount} toko menunggu persetujuan verifikasi!
            </span>
          </div>
        )}
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Navigasi Tab Admin */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1 text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-4 font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === "overview"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Ringkasan & Metrik
        </button>

        <button
          onClick={() => setActiveTab("stores")}
          className={`pb-3 px-4 font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === "stores"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Store className="w-4 h-4" />
          Verifikasi Mitra Toko
          {pendingStoresCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-500 text-white">
              {pendingStoresCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 px-4 font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === "products"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Package className="w-4 h-4" />
          Moderasi Produk Surplus ({products.length})
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 px-4 font-bold flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
            activeTab === "orders"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Audit Transaksi ({orders.length})
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: RINGKASAN METRIK PLATFORM */}
      {/* ========================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Mitra Toko Terdaftar
              </span>
              <div className="text-3xl font-black text-[#144131] mt-1">
                {stores.length} Gerai
              </div>
              <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                {
                  stores.filter((s) => s.verificationStatus === "APPROVED")
                    .length
                }{" "}
                Aktif Diverifikasi
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Porsi Diselamatkan
              </span>
              <div className="text-3xl font-black text-emerald-600 mt-1">
                128 Porsi
              </div>
              <span className="text-[11px] text-gray-400 font-medium block mt-1">
                Bebas dari limbah TPA
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Emisi CO2 Dicegah
              </span>
              <div className="text-3xl font-black text-emerald-700 mt-1">
                320 Kg
              </div>
              <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                Dampak lingkungan positif
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Total Nilai Penghematan
              </span>
              <div className="text-2xl font-black text-gray-900 mt-1">
                {formatRupiah(4780000)}
              </div>
              <span className="text-[11px] text-gray-400 font-medium block mt-1">
                Penghematan belanja pembeli
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: VERIFIKASI MITRA TOKO */}
      {/* ========================================================= */}
      {activeTab === "stores" && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-black text-sm text-gray-900">
                Daftar Permohonan & Kemitraan Toko
              </h3>
              <span className="text-xs text-gray-500">
                Total {stores.length} toko
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {stores.map((s) => (
                <div
                  key={s.id}
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-base text-gray-900">
                        {s.name}
                      </h4>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          s.verificationStatus === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : s.verificationStatus === "PENDING"
                              ? "bg-amber-100 text-amber-900 animate-pulse"
                              : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {s.verificationStatus === "APPROVED"
                          ? "✓ TERVERIFIKASI"
                          : s.verificationStatus === "PENDING"
                            ? "⏳ MENUNGGU VERIFIKASI"
                            : "✕ DITOLAK"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600">
                      Pemilik: <strong>{s.ownerName}</strong> &bull; {s.email}{" "}
                      &bull; {s.phone}
                    </p>
                    <p className="text-xs text-gray-500">
                      Lokasi: {s.address}, {s.city}
                    </p>
                  </div>

                  {/* Tombol Aksi Verifikasi */}
                  <div className="flex items-center gap-2 self-start lg:self-center">
                    {s.verificationStatus === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleApproveStore(s.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" /> Setujui Toko
                        </button>
                        <button
                          onClick={() => setRejectingStore(s)}
                          className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <X className="w-4 h-4" /> Tolak
                        </button>
                      </>
                    )}

                    {s.verificationStatus === "APPROVED" && (
                      <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl">
                        Toko Resmi Aktif
                      </span>
                    )}

                    {s.verificationStatus === "REJECTED" && (
                      <button
                        onClick={() => handleApproveStore(s.id)}
                        className="px-3 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-xs font-bold text-gray-700 cursor-pointer"
                      >
                        Pulihkan / Setujui Ulang
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: MODERASI PRODUK SURPLUS */}
      {/* ========================================================= */}
      {activeTab === "products" && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-black text-sm text-gray-900">
                Pengawasan & Moderasi Makanan Surplus
              </h3>
              <span className="text-xs text-gray-500">
                {products.length} menu terdaftar
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                      {p.storeName} &bull; {p.category}
                    </span>
                    <h4 className="font-bold text-sm text-gray-900">
                      {p.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="font-black text-emerald-700">
                        {formatRupiah(p.discountPrice)}
                      </span>
                      <span className="text-gray-400 line-through">
                        {formatRupiah(p.originalPrice)}
                      </span>
                      <span className="text-gray-500">
                        &bull; Stok: {p.stock} porsi
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        p.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.isActive
                        ? "Tayang di Aplikasi"
                        : "Dinonaktifkan Admin"}
                    </span>
                    <button
                      onClick={() => handleToggleProduct(p.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition ${
                        p.isActive
                          ? "border border-rose-300 text-rose-700 hover:bg-rose-50"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {p.isActive ? "Nonaktifkan" : "Aktifkan Kembali"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: AUDIT TRANSAKSI & PESANAN */}
      {/* ========================================================= */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-black text-sm text-gray-900">
              Audit Riwayat Transaksi Platform
            </h3>
            <span className="text-xs text-gray-500">Semua pesanan</span>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {orders.map((o) => (
              <div
                key={o.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-[#144131]">
                      #{o.orderNumber}
                    </span>
                    <span className="text-gray-300">&bull;</span>
                    <span className="font-bold text-gray-800">
                      {o.customerName}
                    </span>
                    <span className="text-gray-400">&rarr;</span>
                    <span className="font-bold text-emerald-800">
                      {o.storeName}
                    </span>
                  </div>
                  <div className="text-gray-500 flex items-center gap-2">
                    <span>
                      Kode Pickup:{" "}
                      <strong className="font-mono text-gray-800">
                        {o.pickupCode}
                      </strong>
                    </span>
                    <span>&bull;</span>
                    <span>{o.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-black text-sm text-gray-900">
                    {formatRupiah(o.totalAmount)}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-black ${
                      o.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {o.status === "COMPLETED" ? "SELESAI" : "SIAP DI KASIR"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL PENOLAKAN TOKO */}
      {rejectingStore && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base">
                Alasan Penolakan Toko
              </h3>
              <button
                onClick={() => setRejectingStore(null)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Tuliskan alasan penolakan untuk toko{" "}
              <strong>{rejectingStore.name}</strong> agar mereka dapat
              memperbaikinya.
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Contoh: Foto lokasi kurang jelas, nomor WhatsApp tidak aktif..."
              className="w-full p-3 rounded-2xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setRejectingStore(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleRejectStore}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
              >
                Kirim Penolakan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
