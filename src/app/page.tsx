"use client";

import React, { useState, useEffect } from "react";
import {
  Leaf,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Store,
  Search,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Target,
  Globe,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  MapPin,
  X,
  Filter,
} from "lucide-react";
import { Product, PlatformStats, Category, Order } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { CartDrawer } from "@/components/CartDrawer";
import { OrderSuccessModal } from "@/components/OrderSuccessModal";
import { AuthModal } from "@/components/AuthModal";
import { MerchantPortalView } from "@/views/MerchantPortalView";

// Data pesanan contoh untuk konsumen (sesuai tipe Order & OrderItem resmi)
const DEMO_CONSUMER_ORDERS: Order[] = [
  {
    id: "ord-sample-1",
    orderNumber: "FR-9042",
    userId: "cust-demo",
    merchantId: "m-demo-1",
    user: {
      id: "cust-demo",
      name: "Pelanggan FoodRescue",
      email: "user@example.com",
      phone: "0812-3456-7890",
    },
    merchant: {
      id: "m-demo-1",
      userId: "u-demo-merchant",
      businessName: "Marco Bakehouse & Artisan Pastry",
      slug: "marco-bakehouse",
      description:
        "Toko roti dan pastry khas Eropa dengan bahan premium butter & natural yeast.",
      address: "Jl. Senopati No. 42, Kebayoran Baru",
      city: "Jakarta Selatan",
      phone: "0812-8899-0011",
      openHours: "08:00 - 21:30 WIB",
      pickupNotes:
        "Silakan ke kasir depan, sebutkan FoodRescue dan tunjukkan kode 6-digit.",
      status: "APPROVED",
    },
    paymentStatus: "PAID_SIMULATION",
    paymentMethod: "QRIS",
    totalAmount: 38000,
    totalSavings: 42000,
    status: "READY_FOR_PICKUP",
    pickupEstimatedAt: "Hari ini, 18:30 - 21:00 WIB",
    pickupCode: "849102",
    createdAt: "Baru saja",
    updatedAt: "Baru saja",
    items: [
      {
        id: "item-1",
        orderId: "ord-sample-1",
        productId: "p-1",
        productName: "Butter Croissant Premium Pack (Isi 2)",
        quantity: 1,
        originalPrice: 40000,
        surplusPrice: 20000,
        subtotal: 20000,
      },
      {
        id: "item-2",
        orderId: "ord-sample-1",
        productId: "p-2",
        productName: "Cinnamon Roll Glaze Signature",
        quantity: 1,
        originalPrice: 35000,
        surplusPrice: 18000,
        subtotal: 18000,
      },
    ],
  },
  {
    id: "ord-sample-2",
    orderNumber: "FR-8731",
    userId: "cust-demo",
    merchantId: "m-demo-2",
    user: {
      id: "cust-demo",
      name: "Pelanggan FoodRescue",
      email: "user@example.com",
      phone: "0812-3456-7890",
    },
    merchant: {
      id: "m-demo-2",
      userId: "u-demo-merchant-2",
      businessName: "Kopi & Kudapan Senja",
      slug: "kopi-senja",
      description: "Kafe artisanal dengan aneka pastry dan bento bowl sehat.",
      address: "Jl. Kemang Raya No. 18",
      city: "Jakarta Selatan",
      phone: "0856-1122-3344",
      openHours: "09:00 - 22:00 WIB",
      pickupNotes: "Ambil di bar kasir lantai 1.",
      status: "APPROVED",
    },
    paymentStatus: "PAID_SIMULATION",
    paymentMethod: "GoPay",
    totalAmount: 29000,
    totalSavings: 36000,
    status: "COMPLETED",
    pickupEstimatedAt: "Kemarin, 19:00 WIB",
    pickupCode: "512930",
    createdAt: "Kemarin",
    updatedAt: "Kemarin",
    items: [
      {
        id: "item-3",
        orderId: "ord-sample-2",
        productId: "p-3",
        productName: "Country Sourdough Loaf (Whole 500g)",
        quantity: 1,
        originalPrice: 65000,
        surplusPrice: 29000,
        subtotal: 29000,
      },
    ],
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState("home");
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>(DEMO_CONSUMER_ORDERS);
  const [loading, setLoading] = useState(true);

  // Filter Status Riwayat Pesanan
  const [orderFilter, setOrderFilter] = useState<
    "ALL" | "ACTIVE" | "COMPLETED"
  >("ALL");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Filter Catalog (Search & Category)
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  const loadData = async () => {
    try {
      const [statsRes, catRes, prodRes] = await Promise.all([
        fetch("/api/stats").catch(() => null),
        fetch("/api/categories").catch(() => null),
        fetch("/api/products").catch(() => null),
      ]);

      if (statsRes && statsRes.ok) setStats(await statsRes.json());
      if (catRes && catRes.ok) setCategories(await catRes.json());
      if (prodRes && prodRes.ok) setProducts(await prodRes.json());

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("foodrescue_token")
          : null;
      if (token) {
        const orderRes = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (orderRes.ok) {
          const userOrders = await orderRes.json();
          if (Array.isArray(userOrders) && userOrders.length > 0) {
            setOrders(userOrders);
          }
        }
      }
    } catch (err) {
      console.error("Gagal load data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleNavigate = (v: string) => {
    if (v === "about") {
      setCurrentView("home");
      setTimeout(() => {
        const el = document.getElementById("visi-misi");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }
    if (v === "faq") {
      setCurrentView("home");
      setTimeout(() => {
        const el = document.getElementById("faq");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }
    if (v === "merchant-portal" || v === "merchant") {
      setCurrentView("merchant");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setCurrentView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== "ALL" && p.categoryId !== selectedCategory)
      return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "ACTIVE") {
      return (
        o.status === "PENDING_CONFIRMATION" ||
        o.status === "CONFIRMED" ||
        o.status === "READY_FOR_PICKUP"
      );
    }
    if (orderFilter === "COMPLETED") {
      return o.status === "COMPLETED";
    }
    return true;
  });

  const faqs = [
    {
      q: 'Apa yang dimaksud dengan "Makanan Surplus" di FoodRescue?',
      a: "Makanan surplus adalah makanan lezat dan berkualitas yang baru dimasak atau diproduksi oleh merchant F&B pada hari itu, tetapi belum terjual menjelang jam tutup toko. Ini BUKAN makanan sisa piring atau basi, melainkan kelebihan stok harian yang masih sangat segar, higienis, dan layak konsumsi.",
    },
    {
      q: "Apakah makanan surplus aman dan layak dikonsumsi?",
      a: "Sangat aman! Seluruh mitra merchant FoodRescue telah diverifikasi standar higienitasnya. Setiap makanan wajib menyertakan informasi batas waktu konsumsi terbaik (best-before) dan petunjuk penyimpanan.",
    },
    {
      q: "Bagaimana alur pemesanan dan pengambilan di toko mitra?",
      a: "Pilih menu surplus di aplikasi, lalu checkout. Anda akan memperoleh Kode Verifikasi 6-Digit di halaman riwayat pesanan. Datang ke gerai toko mitra sesuai jam pengambilan, tunjukkan kode 6-digit ke kasir, bayar di kasir, dan bawa pulang makanan lezat Anda.",
    },
    {
      q: "Bagaimana cara pelaku usaha kuliner bergabung menjadi mitra merchant?",
      a: "Cukup buka 'Portal Merchant' atau klik tombol 'Daftar Sebagai Mitra F&B Sekarang'. Tim FoodRescue akan memvalidasi usaha Anda agar toko Anda bisa langsung menjual surplus makanan hari ini.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0b241b] text-white">
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1">
        {/* ========================================================= */}
        {/* VIEW 1: BERANDA LENGKAP */}
        {/* ========================================================= */}
        {currentView === "home" && (
          <div className="space-y-16 pb-16">
            {/* 1. Hero Section */}
            <section className="bg-gradient-to-b from-[#144131] to-[#0b241b] text-white pt-12 pb-20 px-4 sm:px-6 text-center md:text-left">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/90 text-emerald-300 text-xs font-bold border border-emerald-600/50">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    Pencegahan Food Waste &amp; Makanan Murah Berkualitas
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black leading-tight text-white">
                    Makanan Segar Lezat,{" "}
                    <span className="text-emerald-400">Hemat Hingga 60%</span>.
                  </h1>
                  <p className="text-emerald-100 text-xs sm:text-sm max-w-lg leading-relaxed">
                    Setiap sore, toko roti dan restoran memiliki surplus makanan
                    lezat harian yang belum terjual. Selamatkan makanan hari ini
                    sebelum terbuang sia-sia!
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
                    <button
                      onClick={() => setCurrentView("catalog")}
                      className="px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-[#0b241b] font-black text-xs shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" /> Jelajah Makanan
                      Surplus
                    </button>
                    <button
                      onClick={() => handleNavigate("orders")}
                      className="px-6 py-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-white border border-emerald-600/60 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span>Lihat Riwayat Pesanan</span>
                    </button>
                  </div>
                </div>

                <div className="md:col-span-5 flex justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
                    alt="Bakery Food Rescue"
                    className="rounded-2xl shadow-2xl border-4 border-white/20 w-full max-w-sm object-cover h-64"
                  />
                </div>
              </div>
            </section>

            {/* 2. Impact Metrics Banner */}
            <section className="max-w-7xl mx-auto px-4 -mt-10">
              <div className="bg-white text-gray-900 rounded-2xl shadow-xl border border-gray-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <span className="block text-2xl sm:text-3xl font-black text-[#144131]">
                    {stats?.totalFoodRescuedPortions || 120}+
                  </span>
                  <span className="text-xs text-gray-700 font-bold">
                    Porsi Terjual
                  </span>
                </div>
                <div>
                  <span className="block text-2xl sm:text-3xl font-black text-emerald-600">
                    {stats?.co2SavedKg || 300} kg
                  </span>
                  <span className="text-xs text-gray-700 font-bold">
                    Emisi CO2 Dicegah
                  </span>
                </div>
                <div>
                  <span className="block text-2xl sm:text-3xl font-black text-[#144131]">
                    {formatRupiah(stats?.totalMoneySavedIdr || 4700000)}
                  </span>
                  <span className="text-xs text-gray-700 font-bold">
                    Penghematan Pembeli
                  </span>
                </div>
                <div>
                  <span className="block text-2xl sm:text-3xl font-black text-emerald-700">
                    {stats?.totalMerchants || 15}
                  </span>
                  <span className="text-xs text-gray-700 font-bold">
                    Mitra F&amp;B Aktif
                  </span>
                </div>
              </div>
            </section>

            {/* 3. Surplus Paling Cepat Habis */}
            <section className="max-w-7xl mx-auto px-4 space-y-4">
              <div className="flex justify-between items-end border-b border-emerald-900/60 pb-3">
                <div>
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block">
                    ⚡ STOK TERBATAS HARI INI
                  </span>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Surplus Paling Cepat Habis
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentView("catalog")}
                  className="text-xs font-bold text-emerald-300 hover:text-white underline transition cursor-pointer"
                >
                  Lihat Semua Katalog &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.slice(0, 3).map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelect={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            </section>

            {/* 4. CARA KERJA */}
            <section
              id="cara-kerja"
              className="bg-[#10382b] border-y border-emerald-800/80 py-16 px-4 sm:px-6 scroll-mt-20"
            >
              <div className="max-w-5xl mx-auto text-center space-y-10">
                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-900/90 px-3 py-1 rounded-full border border-emerald-600">
                    3 LANGKAH MUDAH
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Cara Kerja FoodRescue
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto leading-relaxed">
                    Selamatkan hidangan segar berkualitas dari merchant F&amp;B
                    favorit Anda hanya dalam beberapa menit.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="bg-white p-6 rounded-2xl border-2 border-emerald-400 shadow-xl space-y-3 text-gray-900">
                    <div className="w-10 h-10 rounded-xl bg-[#144131] text-white flex items-center justify-center font-black text-sm">
                      1
                    </div>
                    <h3 className="font-black text-base text-gray-900">
                      Pilih Makanan
                    </h3>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      Jelajahi surplus roti, hidangan hangat, atau minuman
                      berdiskon 50-60%. Periksa informasi alergen dan batas
                      waktu konsumsinya.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border-2 border-emerald-400 shadow-xl space-y-3 text-gray-900">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                      2
                    </div>
                    <h3 className="font-black text-base text-gray-900">
                      Dapat Kode 6-Digit
                    </h3>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      Lakukan checkout secara aman. Anda akan otomatis
                      mendapatkan Kode Verifikasi 6-Digit unik yang tersimpan di
                      layar pesanan Anda.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border-2 border-emerald-400 shadow-xl space-y-3 text-gray-900">
                    <div className="w-10 h-10 rounded-xl bg-[#144131] text-white flex items-center justify-center font-black text-sm">
                      3
                    </div>
                    <h3 className="font-black text-base text-gray-900">
                      Ambil di Toko Fisik
                    </h3>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">
                      Datangi toko fisik merchant sesuai jam pengambilan,
                      tunjukkan kode 6-digit ke kasir, bayar di kasir, dan
                      nikmati makanan lezat Anda!
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. TENTANG VISI & MISI KAMI */}
            <section
              id="visi-misi"
              className="max-w-7xl mx-auto px-4 sm:px-6 scroll-mt-24"
            >
              <div className="bg-gradient-to-br from-[#144131] via-[#103a2c] to-[#081d15] rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-emerald-700/60 space-y-8">
                <div className="max-w-3xl space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-emerald-300 text-xs font-semibold">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tentang Visi &amp; Misi Kami</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Menghubungkan Kebaikan, Mengurangi Food Waste di Indonesia.
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
                    FoodRescue hadir untuk menjawab paradoks sampah makanan di
                    Indonesia: jutaan ton makanan terbuang ke TPA sementara
                    kebutuhan pangan berkualitas terus meningkat. Kami membangun
                    ekosistem sirkular di mana hidangan surplus bernilai tinggi
                    dapat diselamatkan konsumen dengan harga hemat.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                      <Globe className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-base font-bold text-white">
                      Visi Jangka Panjang
                    </h3>
                    <p className="text-xs text-emerald-100/80 leading-relaxed">
                      Mewujudkan Indonesia bebas dari sampah makanan surplus
                      melalui platform sirkular digital yang efisien,
                      transparan, dan inklusif bagi UMKM hingga gerai kuliner
                      besar.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                      <Target className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-base font-bold text-white">
                      Misi Nyata Kami
                    </h3>
                    <ul className="text-xs text-emerald-100/80 space-y-2 leading-relaxed">
                      <li>
                        • Menghubungkan langsung dapur merchant dengan pembeli
                        lokal.
                      </li>
                      <li>
                        • Menyediakan makanan segar berkualitas hemat 50% - 70%.
                      </li>
                      <li>
                        • Menekan gas metana dan jejak karbon emisi pembuangan
                        makanan.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#081d15]/90 border border-emerald-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center shadow-md">
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                      23 - 48 Juta Ton
                    </span>
                    <p className="text-[11px] text-emerald-200/80 mt-1">
                      Sampah makanan/tahun di Indonesia (Kajian Bappenas RI).
                    </p>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-amber-300">
                      Rp 330 Triliun
                    </span>
                    <p className="text-[11px] text-emerald-200/80 mt-1">
                      Estimasi kerugian ekonomi tahunan akibat makanan terbuang.
                    </p>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                      7.29%
                    </span>
                    <p className="text-[11px] text-emerald-200/80 mt-1">
                      Kontribusi limbah makanan terhadap emisi gas rumah kaca
                      nasional.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 6. PERTANYAAN SERING DIAJUKAN (FAQ ACCORDION) */}
            <section
              id="faq"
              className="max-w-4xl mx-auto px-4 sm:px-6 scroll-mt-24 space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/90 text-emerald-300 border border-emerald-600/70 text-xs font-bold">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tanya Jawab (FAQ)</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Pertanyaan yang Sering Diajukan
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl mx-auto">
                  Pelajari selengkapnya seputar kualitas makanan surplus, kode
                  verifikasi pengambilan, dan kemitraan.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-[#10382b] rounded-2xl border border-emerald-800/80 overflow-hidden transition-all shadow-md"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-white hover:text-emerald-300 cursor-pointer"
                      >
                        <span className="leading-snug">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-emerald-200 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-5 text-xs sm:text-[13px] text-emerald-100/90 leading-relaxed border-t border-emerald-800/80 pt-3 bg-[#0d2e23]">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 7. AJAKAN GABUNG MERCHANT F&B */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="rounded-3xl bg-[#144131] border border-emerald-600/60 text-white p-8 sm:p-12 shadow-2xl">
                <div className="max-w-2xl space-y-4">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                    Untuk Pemilik Restoran, Kafe, &amp; Bakery
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                    Ubah Makanan Berlebih Menjadi Pendapatan &amp; Pelanggan
                    Baru.
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed">
                    Bergabunglah bersama komunitas merchant ramah lingkungan
                    FoodRescue. Kurangi biaya limbah, raih pelanggan baru di
                    sekitar toko Anda, dan bantu jaga kelestarian bumi.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => setIsAuthOpen(true)}
                      className="px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-[#0b241b] font-black text-xs shadow-md transition cursor-pointer"
                    >
                      Daftar Sebagai Mitra F&amp;B Sekarang
                    </button>
                    <button
                      onClick={() => handleNavigate("merchant-portal")}
                      className="px-6 py-3 rounded-xl bg-emerald-900/90 hover:bg-emerald-800 text-white font-bold text-xs border border-emerald-600/60 shadow-md transition cursor-pointer flex items-center gap-2"
                    >
                      <Store className="w-4 h-4 text-emerald-300" />
                      <span>Buka Dashboard Merchant</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: KATALOG SURPLUS */}
        {/* ========================================================= */}
        {currentView === "catalog" && (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            <div>
              <h1 className="text-2xl font-black text-white">
                Katalog Makanan Surplus
              </h1>
              <p className="text-xs text-emerald-200/80 mt-1">
                Pilih dan selamatkan makanan lezat berkualitas dengan harga
                hemat.
              </p>
            </div>

            {/* Kotak Filter & Pencarian Lengkap */}
            <div className="bg-[#144131] p-4 rounded-2xl border border-emerald-800 shadow-md space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari makanan surplus, croissant, bento, salad..."
                  className="w-full pl-9 pr-9 py-2.5 text-xs border border-emerald-700 rounded-xl bg-emerald-950 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Tombol Kategori */}
              <div className="flex gap-2 overflow-x-auto text-xs pb-1">
                <button
                  onClick={() => setSelectedCategory("ALL")}
                  className={`px-3 py-1.5 rounded-full font-bold cursor-pointer transition ${
                    selectedCategory === "ALL"
                      ? "bg-emerald-400 text-[#0b241b]"
                      : "bg-emerald-900 text-emerald-200 hover:bg-emerald-800"
                  }`}
                >
                  Semua
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap cursor-pointer transition ${
                      selectedCategory === c.id
                        ? "bg-emerald-400 text-[#0b241b]"
                        : "bg-emerald-900 text-emerald-200 hover:bg-emerald-800"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Hasil Produk */}
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-[#10382b] rounded-2xl border border-emerald-800/80 text-emerald-200 text-xs font-bold">
                Tidak ada makanan surplus yang cocok dengan kata kunci &ldquo;
                {search}&rdquo;.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelect={(prod) => setSelectedProduct(prod)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: RIWAYAT PESANAN SAYA (LENGKAP DENGAN E-TIKET KASIR) */}
        {/* ========================================================= */}
        {currentView === "orders" && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-gray-900">
            {/* Header Riwayat */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/60 pb-4">
              <div>
                <h1 className="text-2xl font-black text-white">
                  Riwayat Pesanan Saya
                </h1>
                <p className="text-xs text-emerald-200/90 mt-1">
                  Pantau status pesanan dan tunjukkan tiket kode 6-digit ke
                  kasir saat pengambilan.
                </p>
              </div>

              {/* Filter Status Pesanan */}
              <div className="flex items-center gap-1.5 bg-[#144131] p-1.5 rounded-xl border border-emerald-700/60 self-start sm:self-auto">
                <button
                  onClick={() => setOrderFilter("ALL")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    orderFilter === "ALL"
                      ? "bg-emerald-400 text-gray-950 font-black shadow-xs"
                      : "text-emerald-200 hover:text-white"
                  }`}
                >
                  Semua ({orders.length})
                </button>
                <button
                  onClick={() => setOrderFilter("ACTIVE")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    orderFilter === "ACTIVE"
                      ? "bg-emerald-400 text-gray-950 font-black shadow-xs"
                      : "text-emerald-200 hover:text-white"
                  }`}
                >
                  Aktif (
                  {
                    orders.filter(
                      (o) =>
                        o.status !== "COMPLETED" && o.status !== "CANCELLED",
                    ).length
                  }
                  )
                </button>
                <button
                  onClick={() => setOrderFilter("COMPLETED")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    orderFilter === "COMPLETED"
                      ? "bg-emerald-400 text-gray-950 font-black shadow-xs"
                      : "text-emerald-200 hover:text-white"
                  }`}
                >
                  Selesai (
                  {orders.filter((o) => o.status === "COMPLETED").length})
                </button>
              </div>
            </div>

            {/* List Kartu Pesanan */}
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-gray-200 shadow-md space-y-3">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="font-black text-base text-gray-900">
                  Belum Ada Pesanan Dalam Kategori Ini
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  Selamatkan makanan lezat berdiskon 50% - 60% hari ini sebelum
                  toko mitra tutup!
                </p>
                <button
                  onClick={() => setCurrentView("catalog")}
                  className="px-5 py-2.5 rounded-xl bg-[#144131] hover:bg-[#1a5540] text-white text-xs font-black shadow-md cursor-pointer inline-flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>Jelajahi Makanan Surplus</span>
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredOrders.map((o) => {
                  const isActive =
                    o.status === "PENDING_CONFIRMATION" ||
                    o.status === "CONFIRMED" ||
                    o.status === "READY_FOR_PICKUP";

                  return (
                    <div
                      key={o.id}
                      className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 space-y-4 text-gray-900 transition hover:shadow-lg"
                    >
                      {/* Header Pesanan */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-[#144131]">
                            #{o.orderNumber}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-500 font-medium">
                            {o.createdAt || "Hari ini"}
                          </span>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black ${
                            o.status === "PENDING_CONFIRMATION"
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : o.status === "CONFIRMED"
                                ? "bg-purple-100 text-purple-900 border border-purple-300"
                                : o.status === "READY_FOR_PICKUP"
                                  ? "bg-blue-100 text-blue-900 border border-blue-300 animate-pulse"
                                  : o.status === "COMPLETED"
                                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                    : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {o.status === "PENDING_CONFIRMATION"
                            ? "🕒 Menunggu Konfirmasi Toko"
                            : o.status === "CONFIRMED"
                              ? "👨‍🍳 Sedang Disiapkan Toko"
                              : o.status === "READY_FOR_PICKUP"
                                ? "🛍️ Siap Diambil di Kasir"
                                : o.status === "COMPLETED"
                                  ? "✅ Selesai Diambil"
                                  : o.status}
                        </span>
                      </div>

                      {/* E-TIKET KODE 6-DIGIT PENGAMBILAN */}
                      {isActive && (
                        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/70 p-4 sm:p-5 rounded-2xl border-2 border-dashed border-emerald-400 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="text-center sm:text-left space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 block">
                              TIKET PENGAMBILAN KASIR (TUNJUKKAN KE TOKO)
                            </span>
                            <div className="flex items-center gap-3 justify-center sm:justify-start">
                              <span className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-[#144131]">
                                {o.pickupCode}
                              </span>
                              <button
                                onClick={() => handleCopyCode(o.pickupCode)}
                                className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-50 flex items-center gap-1 shadow-xs cursor-pointer"
                              >
                                {copiedCode === o.pickupCode ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Tersalin!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Salin</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <p className="text-[11px] text-emerald-800">
                              Batas Pengambilan:{" "}
                              <strong>
                                {o.pickupEstimatedAt ||
                                  "Hari ini sesuai jam operasional toko"}
                              </strong>
                            </p>
                          </div>

                          <div className="text-center sm:text-right bg-white/80 p-3 rounded-xl border border-emerald-200">
                            <span className="text-[11px] text-gray-500 block">
                              Metode Bayar:
                            </span>
                            <span className="text-xs font-black text-gray-900 block">
                              {o.paymentMethod || "QRIS / Bayar di Kasir"}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                              Hemat {formatRupiah(o.totalSavings || 0)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Detail Toko Pengambilan */}
                      <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-gray-800">
                          <Store className="w-4 h-4 text-emerald-700 shrink-0" />
                          <div>
                            <span className="font-black text-gray-900">
                              {o.merchant?.businessName ||
                                "Marco Bakehouse & Artisan Pastry"}
                            </span>
                            <span className="text-gray-500 block text-[11px]">
                              {o.merchant?.address ||
                                "Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan"}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-gray-600 sm:text-right shrink-0">
                          Jam Ambil:{" "}
                          {o.merchant?.openHours || "18:30 - 21:00 WIB"}
                        </span>
                      </div>

                      {/* Rincian Item Makanan */}
                      <div className="divide-y divide-gray-100 text-xs">
                        {o.items.map((it) => (
                          <div
                            key={it.id}
                            className="py-2 flex items-center justify-between"
                          >
                            <span className="text-gray-800 font-medium">
                              • {it.productName}{" "}
                              <strong className="text-gray-950 font-bold">
                                x{it.quantity}
                              </strong>
                            </span>
                            <span className="font-black text-gray-900">
                              {formatRupiah(it.subtotal)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total & Footer Card */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-xs text-emerald-800 font-bold">
                          🌱 Anda telah menyelamatkan{" "}
                          {o.items.reduce((s, it) => s + it.quantity, 0)} porsi
                          surplus makanan!
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-gray-500 mr-2">
                            Total Pembayaran:
                          </span>
                          <span className="text-base font-black text-[#144131]">
                            {formatRupiah(o.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: PORTAL MERCHANT & DASHBOARD KASIR LENGKAP */}
        {/* ========================================================= */}
        {(currentView === "merchant" || currentView === "merchant-portal") && (
          <MerchantPortalView />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* Global Modals */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderSuccess={(ord) => {
          setLatestOrder(ord);
          loadData();
        }}
        onOpenAuth={() => {
          setIsCartOpen(false);
          setIsAuthOpen(true);
        }}
      />

      <OrderSuccessModal
        order={latestOrder}
        onClose={() => setLatestOrder(null)}
        onViewOrders={() => {
          setLatestOrder(null);
          setCurrentView("orders");
        }}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
