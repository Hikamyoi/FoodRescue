import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAuthHeader } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = verifyAuthHeader(req.headers.get("authorization"));
  if (!auth) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 401 });
  }

  const { id } = await params;
  const order = db.orders.find((o) => o.id === id);
  if (!order) {
    return NextResponse.json(
      { error: "Pesanan tidak ditemukan." },
      { status: 404 },
    );
  }

  try {
    const body = await req.json();
    const { status, verifiedPickupCode, cancellationReason } = body;

    // Validasi Kode 6-Digit saat pengambilan kasir
    if (status === "COMPLETED" && verifiedPickupCode) {
      if (order.pickupCode !== verifiedPickupCode.trim()) {
        return NextResponse.json(
          { error: "Kode verifikasi 6-digit salah." },
          { status: 400 },
        );
      }
    }

    // Jika dibatalkan, kembalikan stok produk
    if (status === "CANCELLED" && order.status !== "CANCELLED") {
      for (const item of order.items) {
        const prod = db.products.find((p) => p.id === item.productId);
        if (prod) prod.stock += item.quantity;
      }
      order.cancellationReason = cancellationReason || "Dibatalkan";
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();

    return NextResponse.json({
      message: `Status pesanan diubah ke ${status}.`,
      order,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal mengubah status." },
      { status: 500 },
    );
  }
}
