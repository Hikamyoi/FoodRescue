// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan kata sandi wajib diisi." },
        { status: 400 },
      );
    }

    // 1. Cari user di DatabaseStore (mendukung db.users array maupun method)
    const dbAny = db as any;
    const usersList: any[] = dbAny.users || [];

    const user =
      typeof dbAny.findUserByEmail === "function"
        ? dbAny.findUserByEmail(email)
        : usersList.find(
            (u: any) => u.email?.toLowerCase() === email.toLowerCase(),
          );

    if (!user) {
      return NextResponse.json(
        { error: "Email atau kata sandi salah." },
        { status: 401 },
      );
    }

    // 2. Cek password hash atau plain text password
    let isValid = false;
    if (user.passwordHash) {
      try {
        isValid = bcrypt.compareSync(password, user.passwordHash);
      } catch {
        isValid = user.passwordHash === password;
      }
    } else if (user.password) {
      isValid = user.password === password;
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Email atau kata sandi salah." },
        { status: 401 },
      );
    }

    // 3. Ambil data toko jika rolenya MERCHANT
    let merchantProfile = undefined;
    if (user.role === "MERCHANT") {
      const merchantsList: any[] = dbAny.merchants || [];
      merchantProfile =
        typeof dbAny.findMerchantByUserId === "function"
          ? dbAny.findMerchantByUserId(user.id)
          : merchantsList.find((m: any) => m.userId === user.id);
    }

    // 4. Buat Token
    let token = `token_${Date.now()}`;
    if (typeof signToken === "function") {
      try {
        token = signToken(user);
      } catch {
        token = `token_${user.id}_${Date.now()}`;
      }
    }

    return NextResponse.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
      merchant: merchantProfile,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan pada server saat login." },
      { status: 500 },
    );
  }
}
