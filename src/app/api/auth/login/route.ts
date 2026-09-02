/**
 * Admin login.
 *
 * Verifies against `ADMIN_PASSWORD_HASH` (scrypt) in constant time, rate
 * limits per IP, and on success sets an httpOnly signed session cookie.
 * The password never leaves this handler and is never logged.
 */

import { NextResponse } from "next/server";
import {
  checkRateLimit,
  clearAttempts,
  clientIp,
  isAuthConfigured,
  recordFailure,
  startSession,
  verifyPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  const ip = clientIp(request.headers);

  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: `Too many failed attempts. Try again in ${Math.ceil((limit.retryAfterSec ?? 0) / 60)} minutes.`,
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec ?? 900) } }
    );
  }

  if (!isAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "Admin auth isn't configured. Set ADMIN_PASSWORD_HASH and AUTH_SECRET — see the README.",
      },
      { status: 503 }
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  const valid = await verifyPassword(password, process.env.ADMIN_PASSWORD_HASH!);

  if (!valid) {
    recordFailure(ip);
    // Deliberately vague — never reveal whether anything else was wrong.
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  clearAttempts(ip);
  await startSession();

  return NextResponse.json({ ok: true });
}
