import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "FoodRescue - Platform Marketplace Makanan Surplus",
  description:
    "Selamatkan makanan berlebih berkualitas dari merchant F&B dengan harga hemat dan cegah food waste.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-[#fcfbf7] text-gray-900 antialiased selection:bg-emerald-200">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
