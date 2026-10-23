import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/lib/validators";
import { signToken } from "@/lib/auth";
import { User, Merchant } from "@/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const {
      name,
      email,
      password,
      phone,
      role,
      businessName,
      address,
      city,
      openHours,
      description,
    } = parsed.data;

    const existing = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar di FoodRescue." },
        { status: 400 },
      );
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      passwordHash: bcrypt.hashSync(password, 10),
      name,
      role,
      phone,
    };
    db.users.push(newUser);

    let merchantProfile: Merchant | undefined = undefined;
    if (role === "MERCHANT") {
      merchantProfile = {
        id: `merchant-${Date.now()}`,
        userId: newUser.id,
        businessName: businessName || `${name}'s Store`,
        slug: (businessName || name).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: description || "Mitra F&B FoodRescue.",
        address: address || "Alamat fisik belum diatur",
        city: city || "Jakarta Selatan",
        phone: phone || "-",
        status: "PENDING", // Menunggu verifikasi admin
        openHours: openHours || "09:00 - 21:00",
        pickupNotes: "Pengambilan di konter kasir.",
        logoUrl:
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80",
      };
      db.merchants.push(merchantProfile);
    }

    const token = signToken(newUser);

    return NextResponse.json(
      {
        message: "Registrasi berhasil",
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          phone: newUser.phone,
        },
        merchant: merchantProfile,
      },
      { status: 201 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Gagal mendaftar." },
      { status: 500 },
    );
  }
}
