/**
 * Media upload / list / delete (admin only).
 *
 * Upload validation is strict and server-side: allow-list of MIME types,
 * matching extension check, and a hard size cap. The filename is never
 * trusted — it's sanitised and prefixed with a timestamp in `saveMedia`.
 */

import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import { deleteMedia, listMedia, logActivity, saveMedia } from "@/lib/store";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/avif": [".avif"],
  "image/svg+xml": [".svg"],
  "image/gif": [".gif"],
  "application/pdf": [".pdf"],
};

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

  return NextResponse.json({ files: await listMedia() });
}

export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  let file: File | null = null;
  try {
    const form = await request.formData();
    const candidate = form.get("file");
    if (candidate instanceof File) file = candidate;
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File is too large. Maximum size is ${MAX_BYTES / 1024 / 1024} MB.` },
      { status: 413 }
    );
  }

  const extensions = ALLOWED[file.type];
  if (!extensions) {
    return NextResponse.json(
      { error: `Unsupported file type. Allowed: ${Object.keys(ALLOWED).join(", ")}` },
      { status: 415 }
    );
  }

  // The extension must agree with the declared MIME type — a .exe renamed
  // to .png with a spoofed type shouldn't get through on type alone.
  const name = file.name.toLowerCase();
  if (!extensions.some((ext) => name.endsWith(ext))) {
    return NextResponse.json(
      { error: "File extension doesn't match its type." },
      { status: 415 }
    );
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const url = await saveMedia(file.name, bytes);
    await logActivity("media", `Uploaded ${file.name}`);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("[admin/media] upload failed:", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  let body: { url?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (typeof body.url !== "string") {
    return NextResponse.json({ error: "File url is required" }, { status: 400 });
  }

  const removed = await deleteMedia(body.url);
  if (!removed) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  await logActivity("media", `Deleted ${body.url}`);
  return NextResponse.json({ ok: true });
}
