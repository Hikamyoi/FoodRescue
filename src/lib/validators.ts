import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Nama lengkap minimal 2 karakter").max(100),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  phone: z.string().min(9, "Nomor telepon minimal 9 karakter").optional(),
  role: z.enum(["CONSUMER", "MERCHANT"]).default("CONSUMER"),
  businessName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  openHours: z.string().optional(),
  description: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const ProductBaseSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter").max(150),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  originalPrice: z.number().int().positive("Harga normal harus > 0"),
  surplusPrice: z.number().int().positive("Harga surplus harus > 0"),
  stock: z.number().int().min(1, "Stok minimal 1 porsi"),
  pickupStartTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Format jam harus HH:MM (contoh: 18:00)",
    ),
  pickupEndTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Format jam harus HH:MM (contoh: 21:00)",
    ),
  bestBefore: z.string().min(3, "Batas konsumsi wajib diisi oleh merchant"),
  storageInstruction: z.string().min(3, "Instruksi penyimpanan wajib diisi"),
  allergens: z.string().min(2, "Informasi alergen wajib dicantumkan"),
  imageUrl: z.string().url("URL foto produk harus valid"),
  isActive: z.boolean().default(true),
});

export const CreateProductSchema = ProductBaseSchema.refine(
  (data) => data.surplusPrice < data.originalPrice,
  {
    message: "Harga surplus harus lebih hemat daripada harga normal",
    path: ["surplusPrice"],
  },
);

export const CheckoutOrderSchema = z.object({
  merchantId: z.string().min(1, "Merchant ID wajib ada"),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1, "Keranjang belanja tidak boleh kosong"),
  paymentMethod: z.enum(["PAY_ON_PICKUP", "SIMULATION_VA"]),
  pickupEstimatedAt: z
    .string()
    .min(3, "Waktu perkiraan pengambilan wajib dicantumkan"),
  notes: z.string().optional(),
});
