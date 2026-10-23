import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAuthHeader } from "@/lib/auth";
import { CheckoutOrderSchema } from "@/lib/validators";

// GET: Ambil Pesanan Saya
export async function GET(req: Request) {
  const auth = verifyAuthHeader(req.headers.get("authorization"));
  if (!auth) {
    return NextResponse.json(
      { error: "Harap masuk terlebih dahulu." },
      { status: 401 },
    );
  }

  let orders = db.orders;
  if (auth.role === "CONSUMER") {
    orders = orders.filter((o) => o.userId === auth.userId);
  } else if (auth.role === "MERCHANT") {
    const merchant = db.merchants.find((m) => m.userId === auth.userId);
    orders = merchant ? orders.filter((o) => o.merchantId === merchant.id) : [];
  }

  const enriched = orders
    .map((o) => {
      const merchant = db.merchants.find((m) => m.id === o.merchantId);
      const user = db.users.find((u) => u.id === o.userId);
      return {
        ...o,
        merchant,
        user: user
          ? { id: user.id, name: user.name, phone: user.phone }
          : undefined,
      };
    })
    .reverse();

  return NextResponse.json(enriched);
}

// POST: Checkout Transaksional Atomik
export async function POST(req: Request) {
  const auth = verifyAuthHeader(req.headers.get("authorization"));
  if (!auth) {
    return NextResponse.json(
      { error: "Harap login terlebih dahulu." },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();
    const parsed = CheckoutOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { merchantId, items, paymentMethod, pickupEstimatedAt, notes } =
      parsed.data;

    // Mutex Lock di sisi database
    const order = await db.createOrderAtomically({
      userId: auth.userId,
      merchantId,
      items,
      paymentMethod,
      pickupEstimatedAt,
      notes,
    });

    return NextResponse.json(
      {
        message: "Makanan surplus berhasil Anda selamatkan!",
        order,
      },
      { status: 201 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal memproses pesanan." },
      { status: 400 },
    );
  }
}
