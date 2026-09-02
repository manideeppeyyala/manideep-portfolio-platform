/**
 * Admin content API.
 *
 * GET  → full content document (authenticated)
 * POST → validate and save exactly one top-level key
 *
 * Every write is authenticated, validated against the zod schema, and
 * logged. An unauthenticated caller gets 401 before anything is read.
 */

import { NextResponse } from "next/server";
import { requireAdmin, UnauthorizedError } from "@/lib/auth";
import { getContent, logActivity, saveContentKey } from "@/lib/store";
import { CONTENT_KEYS, validateContentKey, type Content } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw err;
  }

  const content = await getContent();
  return NextResponse.json(content);
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    throw err;
  }

  let payload: { key?: unknown; value?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const key = payload.key;
  if (typeof key !== "string" || !CONTENT_KEYS.includes(key as keyof Content)) {
    return NextResponse.json({ error: "Unknown content key" }, { status: 400 });
  }

  const result = validateContentKey(key as keyof Content, payload.value);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    await saveContentKey(key as keyof Content, result.data);
    await logActivity(key, `Updated ${key}`);

    // Push the change to the live site immediately rather than waiting
    // for the 60s revalidation window.
    revalidatePath("/");
    revalidatePath("/projects/[slug]", "page");

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/content] save failed:", err);
    const message =
      err instanceof Error && err.message.includes("GitHub")
        ? "Couldn't write to the content repository. Check GITHUB_TOKEN and its permissions."
        : "Save failed. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
