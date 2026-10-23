import bcrypt from "bcryptjs";
import {
  User,
  Merchant,
  Category,
  Product,
  Order,
  OrderItem,
  PlatformStats,
} from "@/types";

// Inisialisasi password hash demo
const demoPasswordHash = bcrypt.hashSync("password123", 10);
const now = new Date().toISOString();

class DatabaseStore {
  private lockPromise: Promise<void> = Promise.resolve();

  public users: User[] = [
    {
      id: "user-admin-1",
      email: "admin@foodrescue.id",
      passwordHash: demoPasswordHash,
      name: "Sarah (Admin FoodRescue)",
      role: "ADMIN",
      phone: "081298765430",
    },
    {
      id: "user-merchant-1",
      email: "artisanbakery@foodrescue.id",
      passwordHash: demoPasswordHash,
      name: "Marco (Artisan Bakehouse)",
      role: "MERCHANT",
      phone: "081298765431",
    },
    {
      id: "user-merchant-2",
      email: "kopisenja@foodrescue.id",
      passwordHash: demoPasswordHash,
      name: "Rian (Kopi Senja)",
      role: "MERCHANT",
      phone: "081298765433",
    },
    {
      id: "user-consumer-1",
      email: "budi@gmail.com",
      passwordHash: demoPasswordHash,
      name: "Budi Santoso",
      role: "CONSUMER",
      phone: "081234567890",
    },
  ];

  public merchants: Merchant[] = [
    {
      id: "merchant-1",
      userId: "user-merchant-1",
      businessName: "Artisan Bakehouse & Patisserie",
      slug: "artisan-bakehouse",
      description:
        "Bakery artisan dengan sourdough alami dan butter premium. Menyelamatkan viennoiserie segar harian.",
      address: "Jl. Senopati No. 42, Kebayoran Baru",
      city: "Jakarta Selatan",
      phone: "081298765431",
      status: "APPROVED",
      openHours: "08:00 - 21:30",
      pickupNotes: "Masuk pintu utama, tunjukkan kode 6-digit di kasir roti.",
      logoUrl:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "merchant-2",
      userId: "user-merchant-2",
      businessName: "Kopi Senja Roastery & Cafe",
      slug: "kopi-senja-roastery",
      description:
        "Specialty coffee roastery dengan surplus pastry sore dan cold brew murni.",
      address: "Jl. Teuku Cik Ditiro No. 10, Menteng",
      city: "Jakarta Pusat",
      phone: "081298765433",
      status: "PENDING",
      openHours: "09:00 - 22:00",
      pickupNotes: "Konter kasir barista lantai 1.",
      logoUrl:
        "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=300&q=80",
    },
  ];

  public categories: Category[] = [
    {
      id: "cat-bakery",
      name: "Roti & Pastry",
      slug: "roti-pastry",
      description: "Aneka roti artisan dan viennoiserie segar harian.",
    },
    {
      id: "cat-meals",
      name: "Makanan Siap Santap",
      slug: "makanan-siap-santap",
      description: "Porsi makan berat hangat bergizi berlebih dari resto.",
    },
    {
      id: "cat-coffee",
      name: "Kopi & Minuman",
      slug: "kopi-minuman",
      description: "Cold brew murni dan jus cold-pressed harian.",
    },
    {
      id: "cat-healthy",
      name: "Salad & Sehat",
      slug: "salad-sehat",
      description: "Salad bowl dan hidangan nabati higienis.",
    },
  ];

  public products: Product[] = [
    {
      id: "prod-1",
      merchantId: "merchant-1",
      categoryId: "cat-bakery",
      name: "Mystery Bread & Croissant Rescue Box (Isi 3-4 Pcs)",
      slug: "mystery-bread-croissant-box",
      description:
        "Paket kejutan berisi campuran sourdough iris, almond croissant, atau brioche segar harian.",
      originalPrice: 85000,
      surplusPrice: 38000,
      discountPercent: 55,
      stock: 5,
      pickupStartTime: "18:30",
      pickupEndTime: "21:15",
      bestBefore: "Konsumsi dalam 24 jam setelah pengambilan.",
      storageInstruction:
        "Simpan dalam wadah kedap udara atau hangatkan di oven 180°C.",
      allergens: "Gandum/Gluten, Susu/Dairy, Telur, Almond.",
      imageUrl:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      isActive: true,
    },
    {
      id: "prod-2",
      merchantId: "merchant-1",
      categoryId: "cat-bakery",
      name: "Country Sourdough Loaf (Whole 500g)",
      slug: "country-sourdough-loaf",
      description:
        "Roti sourdough fermentasi alami 24 jam dengan crust renyah dan crumb kenyal.",
      originalPrice: 65000,
      surplusPrice: 29000,
      discountPercent: 55,
      stock: 4,
      pickupStartTime: "18:00",
      pickupEndTime: "21:30",
      bestBefore: "Maksimal 3 hari pada suhu ruang.",
      storageInstruction:
        "Simpan di tempat sejuk kering terbungkus kain bersih.",
      allergens: "Gandum (Gluten). Bebas susu dan telur.",
      imageUrl:
        "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80",
      isActive: true,
    },
    {
      id: "prod-3",
      merchantId: "merchant-1",
      categoryId: "cat-healthy",
      name: "Mediterranean Quinoa & Feta Salad Bowl",
      slug: "mediterranean-quinoa-feta-salad",
      description:
        "Salad segar dengan quinoa matang, selada hidroponik, dan keju feta.",
      originalPrice: 68000,
      surplusPrice: 28000,
      discountPercent: 59,
      stock: 3,
      pickupStartTime: "19:00",
      pickupEndTime: "21:00",
      bestBefore: "Konsumsi dalam 18 jam.",
      storageInstruction: "Wajib disimpan di kulkas dingin (2-5°C).",
      allergens: "Susu (Keju Feta). Bebas gluten.",
      imageUrl:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
      isActive: true,
    },
  ];

  public orders: Order[] = [
    {
      id: "order-demo-1",
      orderNumber: "FR-20261019-8921",
      userId: "user-consumer-1",
      merchantId: "merchant-1",
      status: "READY_FOR_PICKUP",
      paymentStatus: "PAY_ON_PICKUP",
      paymentMethod: "PAY_ON_PICKUP",
      totalAmount: 38000,
      totalSavings: 47000,
      pickupCode: "892104",
      pickupEstimatedAt: "19:30 WIB Hari Ini",
      notes: "Bawa tas belanja sendiri.",
      createdAt: now,
      updatedAt: now,
      items: [
        {
          id: "item-demo-1",
          orderId: "order-demo-1",
          productId: "prod-1",
          productName: "Mystery Bread & Croissant Rescue Box (Isi 3-4 Pcs)",
          originalPrice: 85000,
          surplusPrice: 38000,
          quantity: 1,
          subtotal: 38000,
        },
      ],
    },
  ];

  // Mutex Lock untuk mencegah balapan stok
  public async acquireLock<T>(action: () => Promise<T> | T): Promise<T> {
    const prev = this.lockPromise;
    let release: () => void;
    this.lockPromise = new Promise((res) => {
      release = res;
    });
    try {
      await prev;
      return await action();
    } finally {
      release!();
    }
  }

  // Transaksi checkout atomik
  public async createOrderAtomically(params: {
    userId: string;
    merchantId: string;
    items: { productId: string; quantity: number }[];
    paymentMethod: string;
    pickupEstimatedAt: string;
    notes?: string;
  }): Promise<Order> {
    return this.acquireLock(async () => {
      const merchant = this.merchants.find((m) => m.id === params.merchantId);
      if (!merchant) throw new Error("Merchant tidak ditemukan.");

      let totalAmount = 0;
      let totalSavings = 0;
      const orderItems: OrderItem[] = [];

      // Validasi ketersediaan stok
      for (const item of params.items) {
        const prod = this.products.find((p) => p.id === item.productId);
        if (!prod || !prod.isActive) throw new Error(`Produk tidak tersedia.`);
        if (prod.stock < item.quantity) {
          throw new Error(
            `Maaf, stok untuk "${prod.name}" tersisa ${prod.stock} porsi, tidak mencukupi.`,
          );
        }
      }

      // Pengurangan stok atomik
      const orderId = `order-${Date.now()}`;
      for (const item of params.items) {
        const prod = this.products.find((p) => p.id === item.productId)!;
        prod.stock -= item.quantity;

        const subtotal = prod.surplusPrice * item.quantity;
        totalAmount += subtotal;
        totalSavings +=
          (prod.originalPrice - prod.surplusPrice) * item.quantity;

        orderItems.push({
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          orderId,
          productId: prod.id,
          productName: prod.name,
          originalPrice: prod.originalPrice,
          surplusPrice: prod.surplusPrice,
          quantity: item.quantity,
          subtotal,
        });
      }

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newOrder: Order = {
        id: orderId,
        orderNumber: `FR-20261019-${randomSuffix}`,
        userId: params.userId,
        merchantId: params.merchantId,
        status: "PENDING_CONFIRMATION",
        paymentStatus:
          params.paymentMethod === "SIMULATION_VA"
            ? "PAID_SIMULATION"
            : "PAY_ON_PICKUP",
        paymentMethod: params.paymentMethod,
        totalAmount,
        totalSavings,
        pickupCode: Math.floor(100000 + Math.random() * 900000).toString(),
        pickupEstimatedAt: params.pickupEstimatedAt,
        notes: params.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: orderItems,
      };

      this.orders.push(newOrder);
      return newOrder;
    });
  }

  public getStats(): PlatformStats {
    const rescuedPortions = this.orders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((acc, o) => acc + o.items.reduce((s, i) => s + i.quantity, 0), 0);

    const savedMoney = this.orders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((acc, o) => acc + o.totalSavings, 0);

    return {
      totalMerchants: this.merchants.filter((m) => m.status === "APPROVED")
        .length,
      pendingMerchants: this.merchants.filter((m) => m.status === "PENDING")
        .length,
      totalConsumers: this.users.filter((u) => u.role === "CONSUMER").length,
      totalProductsListed: this.products.length,
      totalFoodRescuedPortions: rescuedPortions,
      totalMoneySavedIdr: savedMoney,
      co2SavedKg: Math.round(rescuedPortions * 2.5),
      totalOrders: this.orders.length,
    };
  }
}

// Global Singleton Store untuk Next.js Server
declare global {
  var __foodrescue_db__: DatabaseStore | undefined;
}

export const db = global.__foodrescue_db__ || new DatabaseStore();
if (process.env.NODE_ENV !== "production") {
  global.__foodrescue_db__ = db;
}
