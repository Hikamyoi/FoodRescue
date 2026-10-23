"use client";

import React from "react";
import { CheckCircle2, Copy, ArrowRight, X } from "lucide-react";
import { Order } from "@/types";

export const OrderSuccessModal: React.FC<{
  order: Order | null;
  onClose: () => void;
  onViewOrders: () => void;
}> = ({ order, onClose, onViewOrders }) => {
  if (!order) return null;

  const copyCode = () => {
    navigator.clipboard.writeText(order.pickupCode);
    alert("Kode pengambilan 6-digit berhasil disalin!");
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="font-bold text-base text-gray-900">
          Makanan Berhasil Diselamatkan!
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Tunjukkan kode berikut ke kasir merchant saat mengambil.
        </p>

        {/* Box Kode 6-Digit */}
        <div className="my-4 p-3.5 rounded-xl bg-emerald-50 border-2 border-dashed border-emerald-400">
          <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
            KODE KASIR PENGAMBILAN
          </span>
          <div className="text-3xl font-black font-mono tracking-widest text-[#144131] my-1">
            {order.pickupCode}
          </div>
          <button
            onClick={copyCode}
            className="text-xs text-emerald-700 underline font-semibold flex items-center justify-center gap-1 mx-auto mt-1"
          >
            <Copy className="w-3 h-3" /> Salin Kode
          </button>
        </div>

        <div className="bg-gray-50 p-2.5 rounded-xl text-left text-xs space-y-1 mb-4 border border-gray-200">
          <div className="flex justify-between">
            <span className="text-gray-400">No. Pesanan:</span>
            <span className="font-mono font-bold">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Bayar:</span>
            <span className="font-bold text-emerald-900">
              {formatRupiah(order.totalAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Waktu Ambil:</span>
            <span>{order.pickupEstimatedAt}</span>
          </div>
        </div>

        <button
          onClick={() => {
            onClose();
            onViewOrders();
          }}
          className="w-full py-2.5 bg-[#144131] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md"
        >
          <span>Lihat Pesanan Saya</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
