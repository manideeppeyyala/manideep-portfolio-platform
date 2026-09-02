/**
 * Contact message management (admin only).
 *
 * GET    → all messages
 * PATCH  → update status (new | read | replied | archived)
 * DELETE → remove permanently
 */

import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import { deleteMessage, getMessages, logActivity, updateMessage } from "@/lib/store";
import { messageStatus } from "@/lib/schema";

async function guard(): Promise<NextResponse | null> {
  try {
    await requireAdmin();
    return null;
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw err;
  }
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;

  return NextResponse.json(await getMessages());
}

export async function PATCH(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  let body: { id?: unknown; status?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof body.id !== "string") {
    return NextResponse.json({ error: "Message id is required" }, { status: 400 });
  }

  const status = messageStatus.safeParse(body.status);
  if (!status.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await updateMessage(body.id, {
    status: status.data,
    readAt: status.data === "read" ? new Date().toISOString() : undefined,
  });

  if (!updated) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  await logActivity("messages", `Marked a message as ${status.data}`);
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  let body: { id?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof body.id !== "string") {
    return NextResponse.json({ error: "Message id is required" }, { status: 400 });
  }

  const removed = await deleteMessage(body.id);
  if (!removed) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  await logActivity("messages", "Deleted a message");
  return NextResponse.json({ ok: true });
}
