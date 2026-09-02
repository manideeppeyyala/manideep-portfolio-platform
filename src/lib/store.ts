/**
 * Data layer.
 *
 * Storage strategy (deliberate, documented in the README):
 *   Production  → JSON files in this GitHub repo, read/written through the
 *                 GitHub Contents API. Every save is a real commit, so the
 *                 content has full version history and can be rolled back
 *                 from GitHub's UI. Costs nothing, needs no database
 *                 service and no card on file.
 *   Development → the same JSON files on the local filesystem.
 *
 * Why not Postgres: this is a single-author portfolio — tens of records,
 * not millions, with one writer. A managed database would add a service,
 * a bill, a connection pool and a migration story for no functional gain.
 * The interface below is intentionally storage-agnostic, so swapping in
 * Postgres later means reimplementing this one file.
 */

import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import {
  contentSchema,
  type ActivityLog,
  type ContactMessage,
  type Content,
} from "./schema";
import { DEFAULT_CONTENT } from "./defaults";

const OWNER = process.env.GITHUB_OWNER ?? "";
const REPO = process.env.GITHUB_REPO ?? "";
const BRANCH = process.env.GITHUB_BRANCH ?? "main";
const TOKEN = process.env.GITHUB_TOKEN ?? "";
const API = "https://api.github.com";

const PATHS = {
  content: "data/content.json",
  messages: "data/messages.json",
  activity: "data/activity.json",
} as const;

type StoreFile = keyof typeof PATHS;

/** GitHub is only usable when fully configured. */
export function isRemoteStore(): boolean {
  return Boolean(OWNER && REPO && TOKEN);
}

/* ------------------------------------------------------------------ */
/* Cache — avoids re-fetching on every render within a request burst.  */
/* ------------------------------------------------------------------ */

type CacheEntry = { data: unknown; sha: string | null; at: number };
const cache = new Map<string, CacheEntry>();
const TTL_MS = 10_000;

function cacheGet(key: string) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit;
  return null;
}

function cacheSet(key: string, data: unknown, sha: string | null) {
  cache.set(key, { data, sha, at: Date.now() });
}

export function invalidateCache(file?: StoreFile) {
  if (file) cache.delete(file);
  else cache.clear();
}

/* ------------------------------------------------------------------ */
/* GitHub transport                                                    */
/* ------------------------------------------------------------------ */

function ghHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function ghRead<T>(filePath: string): Promise<{ data: T | null; sha: string | null }> {
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${filePath}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: ghHeaders(), cache: "no-store" });

  if (res.status === 404) return { data: null, sha: null };
  if (!res.ok) {
    throw new Error(`GitHub read failed (${res.status}) for ${filePath}`);
  }

  const json = (await res.json()) as { content: string; sha: string };
  const decoded = Buffer.from(json.content, "base64").toString("utf-8");
  return { data: JSON.parse(decoded) as T, sha: json.sha };
}

async function ghWrite(filePath: string, data: unknown, message: string, sha: string | null) {
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${filePath}`;
  const body: Record<string, unknown> = {
    message,
    content: Buffer.from(JSON.stringify(data, null, 2)).toString("base64"),
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: ghHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`GitHub write failed (${res.status}): ${detail.slice(0, 300)}`);
  }
  return (await res.json()) as { content: { sha: string } };
}

/* ------------------------------------------------------------------ */
/* Local filesystem transport (development)                            */
/* ------------------------------------------------------------------ */

function localPath(filePath: string) {
  return path.join(process.cwd(), filePath);
}

async function fsRead<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(localPath(filePath), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function fsWrite(filePath: string, data: unknown) {
  const target = localPath(filePath);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, JSON.stringify(data, null, 2), "utf-8");
}

/* ------------------------------------------------------------------ */
/* Generic read / write                                                */
/* ------------------------------------------------------------------ */

async function readFile<T>(file: StoreFile, fallback: T): Promise<T> {
  const cached = cacheGet(file);
  if (cached) return cached.data as T;

  const filePath = PATHS[file];

  try {
    if (isRemoteStore()) {
      const { data, sha } = await ghRead<T>(filePath);
      const value = data ?? fallback;
      cacheSet(file, value, sha);
      return value;
    }
    const data = await fsRead<T>(filePath);
    const value = data ?? fallback;
    cacheSet(file, value, null);
    return value;
  } catch (err) {
    // Never take the site down because storage hiccupped — serve defaults.
    console.error(`[store] read ${file} failed:`, err);
    return fallback;
  }
}

async function writeFile<T>(file: StoreFile, data: T, message: string): Promise<void> {
  const filePath = PATHS[file];

  if (isRemoteStore()) {
    // Always re-read the sha immediately before writing: another commit
    // (or a concurrent admin save) may have moved it.
    const { sha } = await ghRead<T>(filePath);
    await ghWrite(filePath, data, message, sha);
  } else {
    await fsWrite(filePath, data);
  }
  cacheSet(file, data, null);
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

/**
 * Reads the site content, merged over defaults.
 *
 * The merge matters: it means adding a new field to the schema doesn't
 * break an existing install whose stored JSON predates that field.
 */
export async function getContent(): Promise<Content> {
  const stored = await readFile<Partial<Content>>("content", {});
  const merged = { ...DEFAULT_CONTENT, ...stored } as Content;

  const parsed = contentSchema.safeParse(merged);
  if (parsed.success) return parsed.data;

  console.error("[store] stored content failed validation, falling back per-key");

  // Salvage: keep every key that validates, fall back only where broken.
  const salvaged = { ...DEFAULT_CONTENT } as Content;
  for (const key of Object.keys(contentSchema.shape) as (keyof Content)[]) {
    const field = contentSchema.shape[key];
    const attempt = field.safeParse((merged as Record<string, unknown>)[key]);
    if (attempt.success) {
      (salvaged as Record<string, unknown>)[key] = attempt.data;
    }
  }
  return salvaged;
}

export async function saveContentKey<K extends keyof Content>(
  key: K,
  value: Content[K]
): Promise<void> {
  const current = await getContent();
  const next = { ...current, [key]: value };
  await writeFile("content", next, `content: update ${String(key)}`);
  invalidateCache("content");
}

/* ------------------------------------------------------------------ */
/* Contact messages                                                    */
/* ------------------------------------------------------------------ */

export async function getMessages(): Promise<ContactMessage[]> {
  const list = await readFile<ContactMessage[]>("messages", []);
  return Array.isArray(list) ? list : [];
}

export async function addMessage(message: ContactMessage): Promise<void> {
  const list = await getMessages();
  list.unshift(message);
  await writeFile("messages", list.slice(0, 1000), `contact: message from ${message.name}`);
  invalidateCache("messages");
}

export async function updateMessage(
  id: string,
  patch: Partial<ContactMessage>
): Promise<ContactMessage | null> {
  const list = await getMessages();
  const index = list.findIndex((m) => m.id === id);
  if (index === -1) return null;

  const updated = { ...list[index], ...patch, id: list[index].id };
  list[index] = updated;
  await writeFile("messages", list, `contact: ${patch.status ?? "update"} message ${id}`);
  invalidateCache("messages");
  return updated;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const list = await getMessages();
  const next = list.filter((m) => m.id !== id);
  if (next.length === list.length) return false;

  await writeFile("messages", next, `contact: delete message ${id}`);
  invalidateCache("messages");
  return true;
}

/* ------------------------------------------------------------------ */
/* Activity log                                                        */
/* ------------------------------------------------------------------ */

export async function getActivity(): Promise<ActivityLog[]> {
  const list = await readFile<ActivityLog[]>("activity", []);
  return Array.isArray(list) ? list : [];
}

/** Best-effort: an audit-trail failure must never fail the actual save. */
export async function logActivity(module: string, action: string): Promise<void> {
  try {
    const list = await getActivity();
    list.unshift({
      id: `log_${Date.now().toString(36)}`,
      module,
      action,
      at: new Date().toISOString(),
    });
    await writeFile("activity", list.slice(0, 200), `log: ${module} — ${action}`);
    invalidateCache("activity");
  } catch (err) {
    console.error("[store] activity log failed:", err);
  }
}

/* ------------------------------------------------------------------ */
/* Media                                                               */
/* ------------------------------------------------------------------ */

/**
 * Commits an uploaded file to `public/uploads/` and returns its public path.
 * Same storage rationale as above: no bucket, no bill, versioned by git.
 */
export async function saveMedia(fileName: string, bytes: Buffer): Promise<string> {
  const safe = fileName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(-80);
  const unique = `${Date.now().toString(36)}-${safe}`;
  const filePath = `public/uploads/${unique}`;

  if (isRemoteStore()) {
    const url = `${API}/repos/${OWNER}/${REPO}/contents/${filePath}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: ghHeaders(),
      body: JSON.stringify({
        message: `media: upload ${unique}`,
        content: bytes.toString("base64"),
        branch: BRANCH,
      }),
    });
    if (!res.ok) {
      throw new Error(`Upload failed (${res.status})`);
    }
  } else {
    const target = localPath(filePath);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, bytes);
  }

  return `/uploads/${unique}`;
}

export async function listMedia(): Promise<string[]> {
  try {
    if (isRemoteStore()) {
      const res = await fetch(
        `${API}/repos/${OWNER}/${REPO}/contents/public/uploads?ref=${BRANCH}`,
        { headers: ghHeaders(), cache: "no-store" }
      );
      if (!res.ok) return [];
      const items = (await res.json()) as { name: string; type: string }[];
      return items.filter((i) => i.type === "file").map((i) => `/uploads/${i.name}`);
    }
    const dir = localPath("public/uploads");
    const names = await fs.readdir(dir);
    return names.filter((n) => !n.startsWith(".")).map((n) => `/uploads/${n}`);
  } catch {
    return [];
  }
}

export async function deleteMedia(publicPath: string): Promise<boolean> {
  const name = publicPath.replace(/^\/uploads\//, "");
  if (!name || name.includes("/") || name.includes("..")) return false;
  const filePath = `public/uploads/${name}`;

  try {
    if (isRemoteStore()) {
      const { sha } = await ghRead<unknown>(filePath).catch(() => ({ sha: null }));
      if (!sha) return false;
      const res = await fetch(`${API}/repos/${OWNER}/${REPO}/contents/${filePath}`, {
        method: "DELETE",
        headers: ghHeaders(),
        body: JSON.stringify({ message: `media: delete ${name}`, sha, branch: BRANCH }),
      });
      return res.ok;
    }
    await fs.unlink(localPath(filePath));
    return true;
  } catch {
    return false;
  }
}
