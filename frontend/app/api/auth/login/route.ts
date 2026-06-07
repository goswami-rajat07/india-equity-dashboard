import { NextResponse } from "next/server";

const SESSION_COOKIE = "ledger_session";
const VALID_TOKEN = "ledger_auth_gorajat_v1";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { username, password } = body as { username?: string; password?: string };

  const validUser = process.env.AUTH_USERNAME;
  const validPass = process.env.AUTH_PASSWORD;

  if (!validUser || !validPass) {
    return NextResponse.json({ ok: false, error: "Auth not configured" }, { status: 500 });
  }

  if (username === validUser && password === validPass) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, VALID_TOKEN, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  }

  return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
}
