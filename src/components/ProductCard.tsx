"use client";

import React from "react";
import { Clock, Store, Plus, Sparkles } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

export const ProductCard: React.FC<{
  product: Product;
  onSelect: (p: Product) => void;
}> = ({ product, onSelect }) => {
  const { addToCart } = useCart();

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-lg transition cursor-pointer overflow-hidden flex flex-col justify-between group"
    >
      <div className="relative aspect-4/3 w-full bg-gray-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Hemat {product.discountPercent}%
        </div>
        <div className="absolute top-2.5 right-2.5 bg-black/70 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
          Sisa {product.stock} porsi
        </div>
        <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-xs text-[10px] font-medium px-2 py-1 rounded-lg text-emerald-900 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-600" /> Ambil:{" "}
            {product.pickupStartTime} - {product.pickupEndTime}
          </span>
          <span className="text-gray-400">Hari ini</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-1">
            <Store className="w-3 h-3 text-emerald-600" />
            <span className="font-semibold text-gray-700 truncate">
              {product.merchant?.businessName || "Mitra FoodRescue"}
            </span>
          </div>
          <h3 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-emerald-800 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-end justify-between gap-2 mt-3">
          <div>
            <div className="text-[10px] text-gray-400 line-through">
              {formatRupiah(product.originalPrice)}
            </div>
            <div className="text-sm sm:text-base font-extrabold text-[#144131]">
              {formatRupiah(product.surplusPrice)}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="p-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200 rounded-xl transition"
            title="Tambah ke Keranjang"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
