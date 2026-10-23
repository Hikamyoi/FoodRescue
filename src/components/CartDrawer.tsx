"use client";

import React, { useState } from "react";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Clock,
  Store,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
  onOpenAuth: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
  onOpenAuth,
}) => {
  const { user } = useAuth();
  const {
    items,
    itemCount,
    totalAmount,
    totalSavings,
    merchantName,
    updateQuantity,
    clearCart,
    checkout,
  } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<
    "PAY_ON_PICKUP" | "SIMULATION_VA"
  >("PAY_ON_PICKUP");
  const [pickupTime, setPickupTime] = useState("19:00 WIB Hari Ini");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCheckout = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const order = await checkout({
        paymentMethod,
        pickupEstimatedAt: pickupTime,
        notes,
      });
      onClose();
      onOrderSuccess(order);
    } catch (err: any) {
      setError(err.message || "Gagal checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end">
      {/* Panel Keranjang: Dikunci dengan text-gray-900 agar semua tulisan di dalamnya hitam pekat */}
      <div className="bg-white text-gray-900 w-full max-w-md h-full shadow-2xl flex flex-col border-l border-gray-200">
        {/* Header Keranjang */}
        <div className="p-4 bg-[#144131] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm">
              Keranjang Surplus ({itemCount})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Isi Keranjang */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 space-y-2">
              <ShoppingBag className="w-10 h-10 text-emerald-600 mb-2" />
              <p className="font-bold text-gray-900 text-sm">
                Keranjang Anda Masih Kosong
              </p>
              <p className="text-[11px] text-gray-500">
                Pilih makanan surplus lezat hari ini sebelum kehabisan!
              </p>
            </div>
          ) : (
            <>
              {/* Banner Toko Merchant */}
              <div className="p-3 bg-emerald-50 rounded-xl flex items-center justify-between border border-emerald-200">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                  <Store className="w-4 h-4 text-emerald-700" />{" "}
                  {merchantName || "Mitra FoodRescue"}
                </span>
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Kosongkan
                </button>
              </div>

              {/* Daftar Produk di Keranjang */}
              <div className="space-y-2.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white border border-gray-200 rounded-xl flex items-center gap-3 shadow-xs text-gray-900"
                  >
                    <img
                      src={item.product?.imageUrl}
                      alt={item.product?.name}
                      className="w-14 h-14 rounded-lg object-cover bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-xs truncate">
                        {item.product?.name}
                      </h4>
                      <div className="font-black text-[#144131] text-xs mt-0.5">
                        {formatRupiah(item.product?.surplusPrice || 0)}
                      </div>
                    </div>
                    {/* Tombol Plus Minus */}
                    <div className="flex items-center border border-gray-300 rounded-lg p-0.5 bg-gray-50">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="w-6 h-6 bg-white rounded flex items-center justify-center text-gray-700 hover:bg-gray-100 font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center font-bold text-gray-900 text-xs">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="w-6 h-6 bg-white rounded flex items-center justify-center text-gray-700 hover:bg-gray-100 font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pilihan Waktu Ambil */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <label className="font-bold text-gray-900 flex items-center gap-1.5 text-xs">
                  <Clock className="w-4 h-4 text-emerald-700" /> Perkiraan Jam
                  Pengambilan
                </label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="18:30 WIB Hari Ini">18:30 WIB Hari Ini</option>
                  <option value="19:00 WIB Hari Ini">19:00 WIB Hari Ini</option>
                  <option value="19:30 WIB Hari Ini">19:30 WIB Hari Ini</option>
                  <option value="20:00 WIB Hari Ini">20:00 WIB Hari Ini</option>
                </select>

                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan ke kasir (contoh: bawa wadah sendiri)..."
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Pilihan Metode Bayar */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <label className="font-bold text-gray-900 block text-xs">
                  Metode Pembayaran
                </label>

                <label className="flex items-center gap-2.5 p-2.5 bg-white border border-gray-300 rounded-xl cursor-pointer hover:border-emerald-600 transition">
                  <input
                    type="radio"
                    name="payMethod"
                    checked={paymentMethod === "PAY_ON_PICKUP"}
                    onChange={() => setPaymentMethod("PAY_ON_PICKUP")}
                    className="accent-emerald-700"
                  />
                  <div className="text-gray-900">
                    <span className="font-bold block text-xs">
                      Bayar di Kasir Toko saat Ambil
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Tunai / QRIS langsung ke kasir merchant
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 bg-white border border-gray-300 rounded-xl cursor-pointer hover:border-emerald-600 transition">
                  <input
                    type="radio"
                    name="payMethod"
                    checked={paymentMethod === "SIMULATION_VA"}
                    onChange={() => setPaymentMethod("SIMULATION_VA")}
                    className="accent-emerald-700"
                  />
                  <div className="text-gray-900">
                    <span className="font-bold block text-xs">
                      Simulasi Lunas Sandbox (Demo)
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Simulasi transaksi non-tunai langsung lunas
                    </span>
                  </div>
                </label>

                <p className="text-[11px] text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200 leading-relaxed font-medium">
                  Transaksi saat ini beroperasi dalam mode operasional langsung
                  & simulasi (belum terhubung ke perbankan nyata).
                </p>
              </div>

              {error && (
                <div className="p-2.5 bg-red-50 text-red-700 rounded-lg flex items-center gap-1.5 font-bold border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Ringkasan Pembayaran */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2.5 text-xs text-gray-900">
            <div className="flex justify-between items-center text-gray-600">
              <span className="font-medium">Total Penghematan Surplus:</span>
              <strong className="text-emerald-700 text-xs">
                -{formatRupiah(totalSavings)}
              </strong>
            </div>

            <div className="flex justify-between items-center text-sm font-black text-gray-900 border-t border-gray-200 pt-2">
              <span>Total Pembayaran:</span>
              <span className="text-[#144131] text-lg font-black">
                {formatRupiah(totalAmount)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-3 bg-[#144131] hover:bg-[#1a5540] text-white font-black rounded-xl transition flex items-center justify-center gap-2 shadow-md text-xs disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {loading ? "Memproses Pesanan..." : "Konfirmasi & Ambil Makanan"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
