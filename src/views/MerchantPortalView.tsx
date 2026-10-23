import React, { useState, useEffect } from "react";
import {
  Store,
  Plus,
  Package,
  ShoppingBag,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  ShieldAlert,
  Sparkles,
  KeyRound,
  X,
  Phone,
  UserCheck,
  Check,
  Star,
} from "lucide-react";
import { Product, Order, Merchant, Category } from "../types";
import { useAuth } from "../context/AuthContext";

// Data Mockup / Demo Lengkap Toko & Kasir
const INITIAL_DEMO_MERCHANT: Merchant = {
  id: "m-demo-1",
  userId: "u-demo-merchant",
  businessName: "Marco Bakehouse & Artisan Pastry",
  slug: "marco-bakehouse",
  description:
    "Toko roti dan pastry khas Eropa dengan bahan premium butter & natural yeast harian.",
  address: "Jl. Senopati No. 42, Kebayoran Baru",
  city: "Jakarta Selatan",
  phone: "0812-8899-0011",
  openHours: "08:00 - 21:30 WIB",
  pickupNotes:
    "Silakan menuju kasir depan, sebutkan pesanan FoodRescue & tunjukkan kode 6 digit.",
  status: "APPROVED",
};

const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: "ord-demo-1",
    orderNumber: "FR-8821",
    userId: "cust-1",
    user: {
      id: "cust-1",
      name: "Dimas Pratama",
      email: "dimas@example.com",
      phone: "0812-9988-7711",
    },
    merchantId: "m-demo-1",
    merchant: INITIAL_DEMO_MERCHANT,
    paymentStatus: "PAID_SIMULATION",
    paymentMethod: "QRIS (Online)",
    totalAmount: 58000,
    totalSavings: 42000,
    status: "PENDING_CONFIRMATION",
    pickupEstimatedAt: "Hari ini, 20:30 WIB",
    pickupCode: "741298",
    notes: "Tolong jangan digabung dengan kantong plastik lain ya kak.",
    createdAt: "5 menit lalu",
    updatedAt: "5 menit lalu",
    items: [
      {
        id: "item-1",
        orderId: "ord-demo-1",
        productId: "p-1",
        productName: "Butter Croissant Premium Box (Isi 2)",
        quantity: 1,
        originalPrice: 65000,
        surplusPrice: 40000,
        subtotal: 40000,
      },
      {
        id: "item-2",
        orderId: "ord-demo-1",
        productId: "p-2",
        productName: "Pain Au Chocolat French Pastry",
        quantity: 1,
        originalPrice: 35000,
        surplusPrice: 18000,
        subtotal: 18000,
      },
    ],
  },
  {
    id: "ord-demo-2",
    orderNumber: "FR-8815",
    userId: "cust-2",
    user: {
      id: "cust-2",
      name: "Sarah Anindita",
      email: "sarah.anindita@example.com",
      phone: "0856-1122-3344",
    },
    merchantId: "m-demo-1",
    merchant: INITIAL_DEMO_MERCHANT,
    paymentStatus: "PAID_SIMULATION",
    paymentMethod: "E-Wallet GoPay",
    totalAmount: 35000,
    totalSavings: 30000,
    status: "CONFIRMED",
    pickupEstimatedAt: "Hari ini, 20:00 WIB",
    pickupCode: "512930",
    notes: "Saya bawa kantong belanja sendiri dari rumah.",
    createdAt: "15 menit lalu",
    updatedAt: "10 menit lalu",
    items: [
      {
        id: "item-3",
        orderId: "ord-demo-2",
        productId: "p-3",
        productName: "Artisan Sourdough Country Loaf",
        quantity: 1,
        originalPrice: 65000,
        surplusPrice: 35000,
        subtotal: 35000,
      },
    ],
  },
  {
    id: "ord-demo-3",
    orderNumber: "FR-8809",
    userId: "cust-3",
    user: {
      id: "cust-3",
      name: "Rian Hartono",
      email: "rian.hartono@example.com",
      phone: "0877-4455-6677",
    },
    merchantId: "m-demo-1",
    merchant: INITIAL_DEMO_MERCHANT,
    paymentStatus: "PAID_SIMULATION",
    paymentMethod: "BCA Virtual Account",
    totalAmount: 45000,
    totalSavings: 30000,
    status: "READY_FOR_PICKUP",
    pickupEstimatedAt: "Hari ini, 19:00 - 20:30 WIB",
    pickupCode: "923184",
    notes: "Akan diambil jam 19.45 oleh teman saya.",
    createdAt: "40 menit lalu",
    updatedAt: "20 menit lalu",
    items: [
      {
        id: "item-4",
        orderId: "ord-demo-3",
        productId: "p-4",
        productName: "Choco Danish Supreme (Isi 3)",
        quantity: 1,
        originalPrice: 75000,
        surplusPrice: 45000,
        subtotal: 45000,
      },
    ],
  },
  {
    id: "ord-demo-4",
    orderNumber: "FR-8790",
    userId: "cust-4",
    user: {
      id: "cust-4",
      name: "Budi Santoso",
      email: "budi.s@example.com",
      phone: "0813-9090-8877",
    },
    merchantId: "m-demo-1",
    merchant: INITIAL_DEMO_MERCHANT,
    paymentStatus: "PAID_SIMULATION",
    paymentMethod: "QRIS (Online)",
    totalAmount: 28000,
    totalSavings: 22000,
    status: "COMPLETED",
    pickupEstimatedAt: "Hari ini, 17:30 WIB",
    pickupCode: "318920",
    notes: "Terima kasih!",
    createdAt: "2 jam lalu",
    updatedAt: "1 jam lalu",
    items: [
      {
        id: "item-5",
        orderId: "ord-demo-4",
        productId: "p-5",
        productName: "Almond Cinnamon Twist",
        quantity: 1,
        originalPrice: 50000,
        surplusPrice: 28000,
        subtotal: 28000,
      },
    ],
  },
];

const INITIAL_DEMO_PRODUCTS: Product[] = [
  {
    id: "p-1",
    merchantId: "m-demo-1",
    merchant: INITIAL_DEMO_MERCHANT,
    name: "Butter Croissant Premium Box (Isi 2)",
    slug: "butter-croissant-premium-box",
    description:
      "Croissant lapis renyah mentega Prancis murni. Sisa panggang siang hari, kondisi prima dan harum.",
    originalPrice: 65000,
    surplusPrice: 40000,
    discountPercent: 38,
    stock: 4,
    categoryId: "cat-bakery",
    pickupStartTime: "18:30",
    pickupEndTime: "21:30",
    bestBefore: "Konsumsi hari ini s.d. besok pagi (24 jam)",
    storageInstruction:
      "Simpan di suhu ruang wadah tertutup atau hangatkan 3 menit.",
    allergens: "Gandum (Gluten), Mentega (Susu), Telur",
    imageUrl:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    isActive: true,
  },
  {
    id: "p-2",
    merchantId: "m-demo-1",
    merchant: INITIAL_DEMO_MERCHANT,
    name: "Pain Au Chocolat French Pastry",
    slug: "pain-au-chocolat-french-pastry",
    description:
      "Pastry lembut dengan isian batang dark chocolate Belgia premium. Cocok untuk teman kopi pagi/sore.",
    originalPrice: 35000,
    surplusPrice: 18000,
    discountPercent: 49,
    stock: 6,
    categoryId: "cat-bakery",
    pickupStartTime: "18:30",
    pickupEndTime: "21:30",
    bestBefore: "Konsumsi maksimal besok siang",
    storageInstruction:
      "Simpan di lemari pendingin atau oven hangat sebelum dinikmati.",
    allergens: "Gluten, Susu, Cokelat murni",
    imageUrl:
      "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=600&q=80",
    isActive: true,
  },
  {
    id: "p-3",
    merchantId: "m-demo-1",
    merchant: INITIAL_DEMO_MERCHANT,
    name: "Artisan Sourdough Country Loaf",
    slug: "artisan-sourdough-country-loaf",
    description:
      "Roti sourdough fermentasi 24 jam dengan ragi alami liar. Tekstur kenyal dengan crust renyah khas eropa.",
    originalPrice: 65000,
    surplusPrice: 35000,
    discountPercent: 46,
    stock: 2,
    categoryId: "cat-bakery",
    pickupStartTime: "18:30",
    pickupEndTime: "21:30",
    bestBefore: "Bertahan hingga 3 hari di suhu ruang",
    storageInstruction:
      "Bungkus rapat dengan kain atau beeswax wrap. Jangan simpan terbuka.",
    allergens: "Gandum (Gluten)",
    imageUrl:
      "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80",
    isActive: true,
  },
  {
    id: "p-4",
    merchantId: "m-demo-1",
    merchant: INITIAL_DEMO_MERCHANT,
    name: "Choco Danish Supreme (Isi 3)",
    slug: "choco-danish-supreme",
    description:
      "Paket hemat 3 pcs danish cokelat renyah dengan taburan almond flakes panggang.",
    originalPrice: 75000,
    surplusPrice: 45000,
    discountPercent: 40,
    stock: 3,
    categoryId: "cat-bakery",
    pickupStartTime: "18:30",
    pickupEndTime: "21:30",
    bestBefore: "Maksimal 24 jam setelah pembelian",
    storageInstruction: "Simpan di tempat teduh dan sejuk.",
    allergens: "Gluten, Susu, Kacang Almond",
    imageUrl:
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=600&q=80",
    isActive: true,
  },
];

export const MerchantPortalView: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "profile">(
    "orders",
  );
  const [orderFilter, setOrderFilter] = useState<
    "ALL" | "PENDING" | "READY" | "COMPLETED"
  >("ALL");

  const currentMerchant: Merchant = INITIAL_DEMO_MERCHANT;

  const [orders, setOrders] = useState<Order[]>(INITIAL_DEMO_ORDERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_DEMO_PRODUCTS);
  const [, setCategories] = useState<Category[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [verifyingOrder, setVerifyingOrder] = useState<Order | null>(null);
  const [enteredPickupCode, setEnteredPickupCode] = useState<string>("");
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "cat-bakery",
    description: "",
    originalPrice: 50000,
    surplusPrice: 25000,
    stock: 5,
    pickupStartTime: "18:00",
    pickupEndTime: "21:00",
    bestBefore: "Konsumsi sebelum 24 jam.",
    storageInstruction: "Simpan di tempat sejuk atau lemari es.",
    allergens: "Gandum (Gluten), Telur, Susu",
    imageUrl:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    isActive: true,
  });

  const [profileData, setProfileData] = useState({
    businessName: currentMerchant.businessName,
    description: currentMerchant.description,
    address: currentMerchant.address,
    city: currentMerchant.city,
    phone: currentMerchant.phone,
    openHours: currentMerchant.openHours,
    pickupNotes: currentMerchant.pickupNotes,
  });

  const loadData = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("foodrescue_token")
          : null;
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      fetch("/api/categories")
        .then((res) => (res.ok ? res.json() : []))
        .then((cats) => {
          if (Array.isArray(cats) && cats.length > 0) setCategories(cats);
        })
        .catch(() => {});

      if (token) {
        fetch("/api/merchant/products", { headers })
          .then((res) => (res.ok ? res.json() : null))
          .then((prods) => {
            if (Array.isArray(prods) && prods.length > 0) setProducts(prods);
          })
          .catch(() => {});

        fetch("/api/merchant/orders", { headers })
          .then((res) => (res.ok ? res.json() : null))
          .then((ords) => {
            if (Array.isArray(ords) && ords.length > 0) setOrders(ords);
          })
          .catch(() => {});
      }
    } catch {
      // Demo mode fallback
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

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: string,
    verifiedPickupCode?: string,
  ) => {
    setVerifyError(null);

    if (newStatus === "COMPLETED" && verifyingOrder) {
      if (enteredPickupCode.trim() !== verifyingOrder.pickupCode) {
        setVerifyError(
          `Kode salah! Kode verifikasi untuk pesanan ini adalah ${verifyingOrder.pickupCode}`,
        );
        return;
      }
    }

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("foodrescue_token")
          : null;
      if (token && user?.role === "MERCHANT") {
        await fetch(`/api/orders/${orderId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
            verifiedPickupCode,
          }),
        });
      }
    } catch {
      // fallback local update
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus as any } : o,
      ),
    );

    setVerifyingOrder(null);
    setEnteredPickupCode("");
    const statusText =
      newStatus === "CONFIRMED"
        ? "Dikonfirmasi & Sedang Disiapkan"
        : newStatus === "READY_FOR_PICKUP"
          ? "Siap Diambil di Kasir"
          : "Makanan Berhasil Diserahkan ke Konsumen";

    setActionSuccess(
      `Berhasil: Pesanan #${orderId.replace("ord-demo-", "FR-")} ${statusText}!`,
    );
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (formData.surplusPrice >= formData.originalPrice) {
      setFormError("Harga surplus diskon harus lebih murah dari harga normal.");
      return;
    }

    const discount = Math.round(
      ((formData.originalPrice - formData.surplusPrice) /
        formData.originalPrice) *
        100,
    );

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...formData,
                discountPercent: discount,
                updatedAt: "Baru saja",
              }
            : p,
        ),
      );
      setActionSuccess(`Produk "${formData.name}" berhasil diperbarui!`);
    } else {
      const newProd: Product = {
        id: `p-${Date.now()}`,
        merchantId: currentMerchant.id,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        ...formData,
        discountPercent: discount,
      };
      setProducts((prev) => [newProd, ...prev]);
      setActionSuccess(
        `Makanan surplus "${formData.name}" berhasil ditambahkan ke katalog!`,
      );
    }

    setIsAddModalOpen(false);
    setEditingProduct(null);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleAdjustStock = (prodId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === prodId) {
          const newStock = Math.max(0, p.stock + delta);
          return { ...p, stock: newStock, isActive: newStock > 0 };
        }
        return p;
      }),
    );
  };

  const handleDeleteProduct = (prodId: string) => {
    if (
      confirm("Yakin ingin menghapus item surplus ini dari katalog toko Anda?")
    ) {
      setProducts((prev) => prev.filter((p) => p.id !== prodId));
      setActionSuccess("Produk berhasil dihapus.");
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const handleToggleProductStatus = (prodId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === prodId ? { ...p, isActive: !p.isActive } : p)),
    );
  };

  const openAddModal = () => {
    setFormData({
      name: "",
      categoryId: "cat-bakery",
      description: "",
      originalPrice: 50000,
      surplusPrice: 25000,
      stock: 5,
      pickupStartTime: "18:00",
      pickupEndTime: "21:00",
      bestBefore: "Konsumsi sebelum 24 jam.",
      storageInstruction: "Simpan di tempat sejuk atau lemari es.",
      allergens: "Gandum (Gluten), Telur, Susu",
      imageUrl:
        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
      isActive: true,
    });
    setEditingProduct(null);
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setFormData({
      name: prod.name,
      categoryId: prod.categoryId,
      description: prod.description,
      originalPrice: prod.originalPrice,
      surplusPrice: prod.surplusPrice,
      stock: prod.stock,
      pickupStartTime: prod.pickupStartTime,
      pickupEndTime: prod.pickupEndTime,
      bestBefore: prod.bestBefore,
      storageInstruction: prod.storageInstruction,
      allergens: prod.allergens,
      imageUrl: prod.imageUrl,
      isActive: prod.isActive,
    });
    setEditingProduct(prod);
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === "PENDING")
      return o.status === "PENDING_CONFIRMATION" || o.status === "CONFIRMED";
    if (orderFilter === "READY") return o.status === "READY_FOR_PICKUP";
    if (orderFilter === "COMPLETED") return o.status === "COMPLETED";
    return true;
  });

  const pendingOrdersCount = orders.filter(
    (o) => o.status === "PENDING_CONFIRMATION",
  ).length;
  const readyOrdersCount = orders.filter(
    (o) => o.status === "READY_FOR_PICKUP",
  ).length;
  const completedOrdersCount = orders.filter(
    (o) => o.status === "COMPLETED",
  ).length;
  const totalRevenue = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Merchant Profile & Action Header */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-800 flex items-center justify-center shadow-inner shrink-0">
            <Store className="w-9 h-9 text-emerald-800" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                {currentMerchant.businessName}
              </h1>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Mitra
                Resmi Terverifikasi
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl leading-relaxed">
              {currentMerchant.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {currentMerchant.address}, {currentMerchant.city}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                Buka: {currentMerchant.openHours}
              </span>
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                // ✅ GANTI DENGAN INI:
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                Rating 4.9 (88 Ulasan)
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Tambah Makanan Surplus
        </button>
      </div>

      {/* KPI Cards Ringkasan */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
              Perlu Konfirmasi
            </span>
            <div className="text-3xl font-black text-amber-600 mt-1">
              {pendingOrdersCount}
            </div>
            <span className="text-[11px] text-gray-600 font-medium mt-0.5 block">
              Pesanan masuk baru
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
              Siap di Kasir
            </span>
            <div className="text-3xl font-black text-blue-600 mt-1">
              {readyOrdersCount}
            </div>
            <span className="text-[11px] text-gray-600 font-medium mt-0.5 block">
              Menunggu penyerahan
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
              Makanan Diselamatkan
            </span>
            <div className="text-3xl font-black text-emerald-600 mt-1">
              {completedOrdersCount * 2 + 45} porsi
            </div>
            <span className="text-[11px] text-gray-600 font-medium mt-0.5 block">
              Bebas dari food waste
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
              Pendapatan Surplus
            </span>
            <div className="text-2xl font-black text-gray-900 mt-1">
              {formatRupiah(totalRevenue + 1490000)}
            </div>
            <span className="text-[11px] text-gray-600 font-medium mt-0.5 block">
              Dana pemulihan biaya
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Notifikasi feedback aksi sukses */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm font-semibold flex items-center gap-3 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Navigasi Tab */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === "orders"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Pesanan Konsumen & Kasir Pickup
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-800">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === "products"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Package className="w-4 h-4" />
          Katalog Produk Surplus Toko
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
            {products.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === "profile"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <Store className="w-4 h-4" />
          Profil Toko & Petunjuk Kasir
        </button>
      </div>

      {/* TAB 1: OPERASIONAL PESANAN & VERIFIKASI KASIR */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200/80">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-gray-600 mr-1">
                Filter Status:
              </span>
              <button
                onClick={() => setOrderFilter("ALL")}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  orderFilter === "ALL"
                    ? "bg-emerald-700 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Semua ({orders.length})
              </button>
              <button
                onClick={() => setOrderFilter("PENDING")}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  orderFilter === "PENDING"
                    ? "bg-amber-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Perlu Disiapkan (
                {
                  orders.filter(
                    (o) =>
                      o.status === "PENDING_CONFIRMATION" ||
                      o.status === "CONFIRMED",
                  ).length
                }
                )
              </button>
              <button
                onClick={() => setOrderFilter("READY")}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  orderFilter === "READY"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Siap Diambil Kasir ({readyOrdersCount})
              </button>
              <button
                onClick={() => setOrderFilter("COMPLETED")}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  orderFilter === "COMPLETED"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Selesai ({completedOrdersCount})
              </button>
            </div>

            <div className="text-xs text-gray-500 font-medium">
              Total {filteredOrders.length} pesanan
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-200">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-700">
                Belum ada pesanan pada kategori ini
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Pesanan dari pembeli akan otomatis muncul di sini.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((ord) => {
                const isPending = ord.status === "PENDING_CONFIRMATION";
                const isConfirmed = ord.status === "CONFIRMED";
                const isReady = ord.status === "READY_FOR_PICKUP";
                const isCompleted = ord.status === "COMPLETED";

                return (
                  <div
                    key={ord.id}
                    className={`bg-white rounded-3xl border p-5 transition shadow-sm ${
                      isPending
                        ? "border-amber-400 bg-amber-50/20 ring-1 ring-amber-400/30"
                        : isReady
                          ? "border-blue-300 bg-blue-50/10"
                          : "border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-xl text-sm">
                          {ord.orderNumber}
                        </span>
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                            <Clock className="w-3.5 h-3.5 animate-pulse" />{" "}
                            Perlu Dikonfirmasi
                          </span>
                        )}
                        {isConfirmed && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                            <Package className="w-3.5 h-3.5" /> Sedang Dikemas
                            Toko
                          </span>
                        )}
                        {isReady && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />{" "}
                            Siap di Kasir (Menunggu Pembeli)
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />{" "}
                            Selesai Diserahkan
                          </span>
                        )}
                        <span className="text-xs text-gray-500 font-medium">
                          {ord.createdAt} &bull; Pembayaran {ord.paymentMethod}
                        </span>
                      </div>

                      {/* Info Konsumen */}
                      <div className="flex items-center gap-3 text-xs bg-gray-50 px-3 py-2 rounded-xl">
                        <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <div className="font-bold text-gray-900">
                            {ord.user?.name}
                          </div>
                          <div className="text-gray-500">{ord.user?.phone}</div>
                        </div>
                      </div>
                    </div>

                    {/* Daftar Item Pesanan */}
                    <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Item Makanan Surplus:
                        </h4>
                        <div className="space-y-2">
                          {ord.items.map((it) => (
                            <div
                              key={it.id}
                              className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50"
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                                  {it.quantity}x
                                </span>
                                <span className="font-medium text-gray-800">
                                  {it.productName}
                                </span>
                              </div>
                              <span className="font-bold text-gray-900">
                                {formatRupiah(
                                  it.subtotal || it.surplusPrice * it.quantity,
                                )}
                              </span>
                            </div>
                          ))}
                        </div>

                        {ord.notes && (
                          <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                            <strong>Catatan Pembeli:</strong> {ord.notes}
                          </div>
                        )}
                      </div>

                      {/* Detail Total & Kasir Verifikasi Box */}
                      <div className="bg-[#f9faf9] p-4 rounded-2xl border border-gray-200/80 flex flex-col justify-between">
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between text-gray-500">
                            <span>Estimasi Jam Ambil:</span>
                            <span className="font-bold text-gray-800">
                              {ord.pickupEstimatedAt}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-500">
                            <span>Total Pembayaran:</span>
                            <span className="font-black text-emerald-700 text-sm">
                              {formatRupiah(ord.totalAmount)}
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-500">
                            <span>Status Bayar:</span>
                            <span className="font-semibold text-emerald-700">
                              Lunas ({ord.paymentMethod})
                            </span>
                          </div>
                          <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                            <span className="text-gray-600 font-semibold flex items-center gap-1">
                              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />{" "}
                              Kode Pickup Kasir:
                            </span>
                            <span className="font-mono font-black text-sm bg-emerald-100 text-emerald-900 px-3 py-1 rounded-lg tracking-widest">
                              {ord.pickupCode}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons Kasir Toko */}
                        <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap items-center gap-2">
                          {isPending && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(ord.id, "CONFIRMED")
                              }
                              className="flex-1 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Check className="w-4 h-4" /> Terima & Kemas
                              Pesanan
                            </button>
                          )}

                          {isConfirmed && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(ord.id, "READY_FOR_PICKUP")
                              }
                              className="flex-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Sparkles className="w-4 h-4" /> Taruh di Meja
                              Kasir (Siap Ambil)
                            </button>
                          )}

                          {isReady && (
                            <button
                              onClick={() => {
                                setVerifyingOrder(ord);
                                setEnteredPickupCode("");
                                setVerifyError(null);
                              }}
                              className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <KeyRound className="w-4 h-4" /> Verifikasi Kode 6
                              Digit & Serahkan
                            </button>
                          )}

                          {isCompleted && (
                            <div className="w-full flex items-center justify-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-100/60 py-2 rounded-xl">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />{" "}
                              Selesai & Terverifikasi
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: KATALOG PRODUK SURPLUS TOKO */}
      {activeTab === "products" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200/80">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">
                Daftar Makanan Surplus Toko
              </h3>
              <p className="text-xs text-gray-500">
                Perbarui ketersediaan porsi, harga diskon, atau jam pengambilan
                harian di sini.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tambah Makanan Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-gray-200 p-4 flex gap-4 shadow-sm hover:shadow-md transition"
              >
                <img
                  src={prod.imageUrl}
                  alt={prod.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shrink-0 border border-gray-100"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-sm text-gray-900 leading-snug">
                        {prod.name}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.isActive && prod.stock > 0
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {prod.isActive && prod.stock > 0 ? "Tersedia" : "Habis"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-sm font-black text-emerald-700">
                        {formatRupiah(prod.surplusPrice)}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        {formatRupiah(prod.originalPrice)}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-700">
                        -{prod.discountPercent}%
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" /> Ambil:{" "}
                      {prod.pickupStartTime} - {prod.pickupEndTime}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-medium">
                        Stok:
                      </span>
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleAdjustStock(prod.id, -1)}
                          className="px-2 py-0.5 bg-gray-50 hover:bg-gray-200 text-xs font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-gray-900">
                          {prod.stock}
                        </span>
                        <button
                          onClick={() => handleAdjustStock(prod.id, 1)}
                          className="px-2 py-0.5 bg-gray-50 hover:bg-gray-200 text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                        title="Edit Produk"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleProductStatus(prod.id)}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          prod.isActive
                            ? "text-amber-600 hover:bg-amber-50"
                            : "text-emerald-600 hover:bg-emerald-50"
                        }`}
                        title={
                          prod.isActive
                            ? "Nonaktifkan Sementara"
                            : "Aktifkan Produk"
                        }
                      >
                        {prod.isActive ? "Nonaktif" : "Aktifkan"}
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROFIL TOKO & PETUNJUK KASIR */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Pengaturan Informasi Toko & Petunjuk Kasir
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Informasi ini akan dilihat langsung oleh konsumen pada halaman
              rincian toko dan e-tiket pengambilan.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setActionSuccess("Perubahan profil toko berhasil disimpan!");
              setTimeout(() => setActionSuccess(null), 3000);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nama Usaha / Toko
                </label>
                <input
                  type="text"
                  value={profileData.businessName}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      businessName: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-950 font-semibold bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nomor WhatsApp Operasional
                </label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-950 font-semibold bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Jam Operasional Toko
                </label>
                <input
                  type="text"
                  value={profileData.openHours}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      openHours: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-950 font-semibold bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Kota / Wilayah
                </label>
                <input
                  type="text"
                  value={profileData.city}
                  onChange={(e) =>
                    setProfileData({ ...profileData, city: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-950 font-semibold bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Alamat Lengkap Toko
              </label>
              <textarea
                rows={2}
                value={profileData.address}
                onChange={(e) =>
                  setProfileData({ ...profileData, address: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-950 font-semibold bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Petunjuk Titik Pengambilan bagi Konsumen & Kasir
              </label>
              <textarea
                rows={2}
                value={profileData.pickupNotes}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    pickupNotes: e.target.value,
                  })
                }
                placeholder="Contoh: Datang ke kasir depan, sebutkan pesanan FoodRescue & perlihatkan kode 6 digit."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-950 font-semibold bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition cursor-pointer"
              >
                Simpan Perubahan Toko
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL VERIFIKASI KASIR: INPUT 6 DIGIT CODE */}
      {verifyingOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">
                  Verifikasi Penyerahan Kasir
                </h3>
              </div>
              <button
                onClick={() => setVerifyingOrder(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="font-bold">
                Pesanan: {verifyingOrder.orderNumber} &bull;{" "}
                {verifyingOrder.user?.name}
              </div>
              <div>
                Minta konsumen menyebutkan atau memperlihatkan{" "}
                <strong>6 digit kode pickup</strong> dari aplikasi mereka.
              </div>
            </div>

            {verifyError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{verifyError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Masukkan Kode 6-Digit Konsumen:
              </label>
              <input
                type="text"
                maxLength={6}
                value={enteredPickupCode}
                onChange={(e) =>
                  setEnteredPickupCode(e.target.value.replace(/[^0-9]/g, ""))
                }
                placeholder="Contoh: 923184"
                className="w-full text-center tracking-[0.3em] font-mono text-2xl font-black py-3 rounded-2xl border-2 border-emerald-500 text-gray-950 bg-white focus:ring-4 focus:ring-emerald-500/20 outline-none"
                autoFocus
              />
              <div className="mt-2 text-[11px] text-gray-400 text-center">
                (Tips pengujian: Kode pesanan ini adalah{" "}
                <span className="font-mono font-bold text-emerald-700">
                  {verifyingOrder.pickupCode}
                </span>
                )
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setVerifyingOrder(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 font-bold text-xs text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUpdateStatus(
                    verifyingOrder.id,
                    "COMPLETED",
                    enteredPickupCode,
                  )
                }
                disabled={enteredPickupCode.length < 4}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" /> Validasi & Serahkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT PRODUK SURPLUS */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-900 text-base">
                  {editingProduct
                    ? "Edit Makanan Surplus"
                    : "Tambah Makanan Surplus Baru"}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nama Makanan / Paket
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Contoh: Mystery Croissant Box (Isi 3)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-950 font-semibold bg-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Harga Normal (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        originalPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-950 font-semibold bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Harga Surplus Diskon (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.surplusPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        surplusPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-950 font-semibold bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Jumlah Porsi Tersedia
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-950 font-semibold bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    min={1}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-950 font-semibold bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="cat-bakery">Roti & Pastry</option>
                    <option value="cat-meals">Makanan Berat & Bento</option>
                    <option value="cat-drinks">Kopi & Minuman</option>
                    <option value="cat-dessert">Dessert & Kue</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Mulai Jam Ambil
                  </label>
                  <input
                    type="time"
                    value={formData.pickupStartTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pickupStartTime: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-950 font-semibold bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Selesai Jam Ambil
                  </label>
                  <input
                    type="time"
                    value={formData.pickupEndTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pickupEndTime: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-950 font-semibold bg-white text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Deskripsi Kondisi Makanan
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Jelaskan kualitas makanan, misalnya: Sisa bake siang hari jam 14:00, tekstur masih renyah dan harum."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-950 font-semibold bg-white placeholder-gray-400 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Batas Waktu Konsumsi
                  </label>
                  <input
                    type="text"
                    value={formData.bestBefore}
                    onChange={(e) =>
                      setFormData({ ...formData, bestBefore: e.target.value })
                    }
                    placeholder="Contoh: Konsumsi sebelum 24 jam"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-950 font-semibold bg-white placeholder-gray-400 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Informasi Alergen
                  </label>
                  <input
                    type="text"
                    value={formData.allergens}
                    onChange={(e) =>
                      setFormData({ ...formData, allergens: e.target.value })
                    }
                    placeholder="Gandum, Telur, Susu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-950 font-semibold bg-white placeholder-gray-400 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  URL Foto Makanan
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-950 font-semibold bg-white text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 font-bold text-xs text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  {editingProduct ? "Perbarui Produk" : "Terbitkan ke Katalog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
