export type Role = "CONSUMER" | "MERCHANT" | "ADMIN";

export type MerchantStatus = "PENDING" | "APPROVED" | "REJECTED";

export type OrderStatus =
  | "PENDING_CONFIRMATION"
  | "CONFIRMED"
  | "READY_FOR_PICKUP"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "UNPAID" | "PAID_SIMULATION" | "PAY_ON_PICKUP";

export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  name: string;
  role: Role;
  phone?: string;
  avatarUrl?: string;
}

export interface Merchant {
  id: string;
  userId: string;
  businessName: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  status: MerchantStatus;
  rejectionNote?: string;
  openHours: string;
  pickupNotes?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface Product {
  id: string;
  merchantId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  originalPrice: number;
  surplusPrice: number;
  discountPercent: number;
  stock: number;
  pickupStartTime: string;
  pickupEndTime: string;
  bestBefore: string;
  storageInstruction: string;
  allergens: string;
  imageUrl: string;
  isActive: boolean;
  merchant?: Partial<Merchant>;
  merchantName?: string;
  merchantCity?: string;
}

export interface CartItemWithProduct {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product?: Product;
  merchant?: Partial<Merchant>;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  originalPrice: number;
  surplusPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  merchantId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  totalAmount: number;
  totalSavings: number;
  pickupCode: string; // Kode verifikasi 6-digit kasir
  pickupEstimatedAt: string;
  cancellationReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  merchant?: Partial<Merchant>;
  user?: Partial<User>;
}

export interface PlatformStats {
  totalMerchants: number;
  pendingMerchants: number;
  totalConsumers: number;
  totalProductsListed: number;
  totalFoodRescuedPortions: number;
  totalMoneySavedIdr: number;
  co2SavedKg: number;
  totalOrders: number;
}
