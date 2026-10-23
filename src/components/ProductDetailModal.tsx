"use client";

import React, { useState } from "react";
import {
  X,
  Clock,
  MapPin,
  Store,
  ShieldAlert,
  Thermometer,
  Calendar,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle,
} from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenCart?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenCart,
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="relative aspect-16/9 w-full bg-gray-100">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            Hemat {product.discountPercent}% dari Harga Normal
          </div>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold mb-1">
              <Store className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {product.merchant?.businessName || "Mitra FoodRescue"}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              {product.name}
            </h2>
            <p className="text-gray-600 mt-1 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-500 block uppercase">
                Harga Surplus Hemat
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-[#144131]">
                  {formatRupiah(product.surplusPrice)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {formatRupiah(product.originalPrice)}
                </span>
              </div>
            </div>
            <span className="text-emerald-800 font-bold bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
              Hemat {formatRupiah(product.originalPrice - product.surplusPrice)}
            </span>
          </div>

          {/* Transparansi Pangan & Keamanan */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[11px] flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-700" />{" "}
              Transparansi Pangan
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-gray-400 block text-[10px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-600" /> Jam Pengambilan
                </span>
                <strong className="text-gray-900">
                  {product.pickupStartTime} - {product.pickupEndTime} WIB
                </strong>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-gray-400 block text-[10px] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-600" /> Batas
                  Konsumsi
                </span>
                <strong className="text-gray-900">{product.bestBefore}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-gray-400 block text-[10px] flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-emerald-600" />{" "}
                  Penyimpanan
                </span>
                <span className="text-gray-700 font-medium">
                  {product.storageInstruction}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                <span className="text-gray-400 block text-[10px] flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-amber-500" /> Kandungan
                  Alergen
                </span>
                <span className="text-gray-700 font-medium">
                  {product.allergens}
                </span>
              </div>
            </div>
          </div>

          {product.merchant && (
            <div className="p-2.5 bg-gray-50 rounded-xl text-gray-600 flex items-start gap-1.5 border border-gray-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Lokasi Kasir: {product.merchant.address},{" "}
                {product.merchant.city}
              </span>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
            <div className="flex items-center border border-gray-300 rounded-xl p-0.5 bg-gray-50">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 bg-white rounded flex items-center justify-center"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-10 text-center font-bold">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="w-7 h-7 bg-white rounded flex items-center justify-center"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-[#144131] hover:bg-[#1a5540] text-white"
              }`}
            >
              {added ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
              )}
              {added
                ? "Ditambahkan ke Keranjang!"
                : `Selamatkan (${formatRupiah(product.surplusPrice * quantity)})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
