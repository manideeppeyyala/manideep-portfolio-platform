import { contentSchema } from "../src/lib/schema";
import { DEFAULT_CONTENT } from "../src/lib/defaults";

const r = contentSchema.safeParse(DEFAULT_CONTENT);
if (r.success) {
  console.log("VALID");
} else {
  console.log("INVALID — issues:");
  for (const i of r.error.issues.slice(0, 15)) {
    console.log(" -", i.path.join("."), "→", i.message, `(${i.code})`);
  }
}
