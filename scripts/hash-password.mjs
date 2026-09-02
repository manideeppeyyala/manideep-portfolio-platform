#!/usr/bin/env node
/**
 * Generates the values you need for admin sign-in.
 *
 *   npm run hash-password
 *   npm run hash-password -- "my great password"
 *
 * Prints an ADMIN_PASSWORD_HASH (scrypt) and a fresh AUTH_SECRET.
 * The plaintext password is never written to disk or logged.
 */

import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { promisify } from "node:util";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const scrypt = promisify(scryptCb);

const N = 16384;
const r = 8;
const p = 1;
const KEY_LEN = 64;

async function hashPassword(password) {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, KEY_LEN, { N, r, p });
  return `scrypt:${N}:${r}:${p}:${salt.toString("hex")}:${derived.toString("hex")}`;
}

async function main() {
  let password = process.argv.slice(2).join(" ").trim();

  if (!password) {
    const rl = createInterface({ input: stdin, output: stdout });
    password = (await rl.question("Choose an admin password: ")).trim();
    rl.close();
  }

  if (password.length < 10) {
    console.error("\n✗ Please use at least 10 characters.\n");
    process.exit(1);
  }

  const hash = await hashPassword(password);
  const secret = randomBytes(32).toString("base64");

  console.log(`
✓ Done. Add these to .env.local (and to Vercel → Settings → Environment Variables):

ADMIN_PASSWORD_HASH=${hash}

AUTH_SECRET=${secret}

Notes:
  · The hash is safe to store — your password can't be read back from it.
  · Paste both values exactly as shown, with no quotes around them.
  · Keep AUTH_SECRET private. Changing it signs everyone out.
  · Sign in at /admin/login with the password you just typed.
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
