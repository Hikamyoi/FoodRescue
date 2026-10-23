import jwt from "jsonwebtoken";
import { User, Role } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "foodrescue_jwt_secret_key_2026";

export interface AuthPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
}

export function signToken(user: User): string {
  const payload: AuthPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAuthHeader(header: string | null): AuthPayload | null {
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.split(" ")[1];
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}
