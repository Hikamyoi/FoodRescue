import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAuthHeader } from "@/lib/auth";
import { CreateProductSchema } from "@/lib/validators";
import { Product } from "@/types";

// GET: Katalog Produk Surplus dengan Filter
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search")?.toLowerCase();
  const city = searchParams.get("city")?.toLowerCase();

  let results = db.products.filter((p) => p.isActive && p.stock > 0);

  if (category && category !== "ALL") {
    results = results.filter((p) => p.categoryId === category);
  }

  if (search) {
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.allergens.toLowerCase().includes(search),
    );
  }

  const enriched = results.map((p) => {
    const merchant = db.merchants.find((m) => m.id === p.merchantId);
    return {
      ...p,
      merchant: merchant
        ? {
            id: merchant.id,
            businessName: merchant.businessName,
            city: merchant.city,
            address: merchant.address,
            openHours: merchant.openHours,
            status: merchant.status,
          }
        : undefined,
    };
  });

  if (city && city !== "all") {
    return NextResponse.json(
      enriched.filter((p) => p.merchant?.city?.toLowerCase().includes(city)),
    );
  }

  return NextResponse.json(enriched);
}

// POST: Merchant Menambahkan Produk Surplus Baru
export async function POST(req: Request) {
  const auth = verifyAuthHeader(req.headers.get("authorization"));
  if (!auth || auth.role !== "MERCHANT") {
    return NextResponse.json(
      { error: "Akses ditolak. Fitur khusus Merchant." },
      { status: 403 },
    );
  }

  const merchant = db.merchants.find((m) => m.userId === auth.userId);
  if (!merchant || merchant.status !== "APPROVED") {
    return NextResponse.json(
      { error: "Merchant Anda belum disetujui admin untuk mengunggah produk." },
      { status: 403 },
    );
  }

  try {
    const body = await req.json();
    const parsed = CreateProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const discountPercent = Math.round(
      ((data.originalPrice - data.surplusPrice) / data.originalPrice) * 100,
    );

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      merchantId: merchant.id,
      categoryId: data.categoryId,
      name: data.name,
      slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: data.description,
      originalPrice: data.originalPrice,
      surplusPrice: data.surplusPrice,
      discountPercent,
      stock: data.stock,
      pickupStartTime: data.pickupStartTime,
      pickupEndTime: data.pickupEndTime,
      bestBefore: data.bestBefore,
      storageInstruction: data.storageInstruction,
      allergens: data.allergens,
      imageUrl: data.imageUrl,
      isActive: true,
    };

    db.products.push(newProduct);
    return NextResponse.json(
      { message: "Produk surplus berhasil ditambahkan!", product: newProduct },
      { status: 201 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal menambahkan produk." },
      { status: 500 },
    );
  }
}
