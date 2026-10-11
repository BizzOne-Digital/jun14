import { NextResponse } from "next/server";
import { COOKIE_NAME, createAdminToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as {
    email?: string;
    password?: string;
  };
  const expectedEmail = (
    process.env.ADMIN_EMAIL || "admin@kingdomofdumpling.com"
  ).toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD || "admin@123";

  const emailOk =
    email?.trim().toLowerCase() === expectedEmail;
  const passwordOk = password === expectedPassword;

  if (!emailOk || !passwordOk) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = createAdminToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
