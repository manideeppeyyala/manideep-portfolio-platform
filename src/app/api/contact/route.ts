/**
 * Public contact endpoint.
 *
 * Defence in depth, because this is the only route an anonymous visitor
 * can write through:
 *   1. honeypot — silently accepted, never stored
 *   2. per-IP rate limit
 *   3. zod validation server-side (the client's checks are only for UX)
 *   4. stored fields are explicitly constructed, never spread from the body
 */

import { NextResponse } from "next/server";
import { contactSubmissionSchema, type ContactMessage } from "@/lib/schema";
import { addMessage } from "@/lib/store";
import { clientIp } from "@/lib/auth";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 4;

const submissions = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    submissions.set(ip, recent);
    return true;
  }

  recent.push(now);
  submissions.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = contactSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Please check the form and try again." },
      { status: 400 }
    );
  }

  // Honeypot: a bot filled the hidden field. Return success so it doesn't
  // learn anything, but store nothing.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const ip = clientIp(request.headers);
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages sent. Please try again a little later." },
      { status: 429 }
    );
  }

  const message: ContactMessage = {
    id: `msg_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
    status: "new",
    createdAt: new Date().toISOString(),
    readAt: "",
  };

  try {
    await addMessage(message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] failed to store message:", err);
    return NextResponse.json(
      { error: "Couldn't save your message right now. Please email me directly." },
      { status: 500 }
    );
  }
}
