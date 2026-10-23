"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product, CartItemWithProduct, Order } from "@/types";
import { useAuth } from "./AuthContext";

interface CartContextType {
  items: CartItemWithProduct[];
  itemCount: number;
  totalAmount: number;
  totalSavings: number;
  merchantName: string | null;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (params: {
    paymentMethod: string;
    pickupEstimatedAt: string;
    notes?: string;
  }) => Promise<Order>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("foodrescue_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const saveCart = (newItems: CartItemWithProduct[]) => {
    setItems(newItems);
    localStorage.setItem("foodrescue_cart", JSON.stringify(newItems));
  };

  const itemCount = items.reduce((sum, it) => sum + it.quantity, 0);
  const totalAmount = items.reduce(
    (sum, it) => sum + (it.product?.surplusPrice || 0) * it.quantity,
    0,
  );
  const totalSavings = items.reduce(
    (sum, it) =>
      sum +
      ((it.product?.originalPrice || 0) - (it.product?.surplusPrice || 0)) *
        it.quantity,
    0,
  );

  const merchantName = items[0]?.product?.merchant?.businessName || null;
  const merchantId = items[0]?.product?.merchantId || null;

  const addToCart = (product: Product, quantity = 1) => {
    if (items.length > 0 && merchantId && product.merchantId !== merchantId) {
      const confirmReset = window.confirm(
        `Keranjang Anda berisi produk dari "${merchantName}". Makanan surplus diambil di toko fisik merchant yang sama. Kosongkan keranjang untuk toko baru?`,
      );
      if (!confirmReset) return;
      saveCart([
        {
          id: `cart-${Date.now()}`,
          userId: user?.id || "guest",
          productId: product.id,
          quantity,
          product,
        },
      ]);
      return;
    }

    const existing = items.find((i) => i.productId === product.id);
    const newQty = (existing?.quantity || 0) + quantity;
    if (newQty > product.stock) {
      alert(`Stok tersisa hanya ${product.stock} porsi.`);
      return;
    }

    if (existing) {
      saveCart(
        items.map((i) =>
          i.productId === product.id ? { ...i, quantity: newQty } : i,
        ),
      );
    } else {
      saveCart([
        ...items,
        {
          id: `cart-${Date.now()}`,
          userId: user?.id || "guest",
          productId: product.id,
          quantity: newQty,
          product,
        },
      ]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      saveCart(items.filter((i) => i.productId !== productId));
    } else {
      saveCart(
        items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
      );
    }
  };

  const clearCart = () => {
    saveCart([]);
  };

  const checkout = async (params: {
    paymentMethod: string;
    pickupEstimatedAt: string;
    notes?: string;
  }) => {
    const token = localStorage.getItem("foodrescue_token");
    if (!token)
      throw new Error(
        "Silakan masuk terlebih dahulu untuk menyelesaikan pesanan.",
      );
    if (!merchantId || items.length === 0)
      throw new Error("Keranjang belanja Anda kosong.");

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        merchantId,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        paymentMethod: params.paymentMethod,
        pickupEstimatedAt: params.pickupEstimatedAt,
        notes: params.notes,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Gagal memproses pesanan.");
    clearCart();
    return data.order;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalAmount,
        totalSavings,
        merchantName,
        addToCart,
        updateQuantity,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus digunakan di dalam CartProvider");
  return ctx;
}
