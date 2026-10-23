import {
  User,
  Merchant,
  Category,
  Product,
  CartItemWithProduct,
  Order,
  PlatformStats,
} from "../types/index";

const TOKEN_KEY = "foodrescue_auth_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function removeStoredToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Terjadi kesalahan pada permintaan ke server.",
    );
  }

  return data;
}

export const api = {
  // Auth
  async login(
    email: string,
    password: string,
  ): Promise<{ token: string; user: User; merchant?: Merchant }> {
    const res = await request<{
      token: string;
      user: User;
      merchant?: Merchant;
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(res.token);
    return res;
  },

  async register(
    data: any,
  ): Promise<{ token: string; user: User; merchant?: Merchant }> {
    const res = await request<{
      token: string;
      user: User;
      merchant?: Merchant;
    }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setStoredToken(res.token);
    return res;
  },

  async getMe(): Promise<{ user: User; merchant?: Merchant }> {
    return request<{ user: User; merchant?: Merchant }>("/api/auth/me");
  },

  // Public data
  async getCategories(): Promise<Category[]> {
    return request<Category[]>("/api/categories");
  },

  async getProducts(params?: {
    category?: string;
    search?: string;
    city?: string;
    merchantId?: string;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    if (params?.city) query.set("city", params.city);
    if (params?.merchantId) query.set("merchantId", params.merchantId);

    const qs = query.toString();
    return request<Product[]>(`/api/products${qs ? `?${qs}` : ""}`);
  },

  async getProductById(id: string): Promise<Product & { merchant?: Merchant }> {
    return request<Product & { merchant?: Merchant }>(`/api/products/${id}`);
  },

  async getMerchants(): Promise<Merchant[]> {
    return request<Merchant[]>("/api/merchants");
  },

  async getStats(): Promise<PlatformStats> {
    return request<PlatformStats>("/api/stats");
  },

  // Cart & Orders
  async getCart(): Promise<CartItemWithProduct[]> {
    return request<CartItemWithProduct[]>("/api/cart");
  },

  async addToCart(
    productId: string,
    quantity: number = 1,
  ): Promise<CartItemWithProduct> {
    return request<CartItemWithProduct>("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  },

  async getMyOrders(): Promise<Order[]> {
    return request<Order[]>("/api/orders");
  },

  async checkout(
    paymentMethod: "SIMULATED_QRIS" | "PAY_ON_PICKUP",
    notes?: string,
  ): Promise<Order> {
    return request<Order>("/api/orders/checkout", {
      method: "POST",
      body: JSON.stringify({ paymentMethod, notes }),
    });
  },
};
