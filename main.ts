import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Dear Human: The AI Breakup Line — make.fun entry program.
// Reads entry.txt next to this file, validates it, and copies it verbatim
// to $MAKEFUN_OUTPUT_DIR/entry.txt. No rendering, no network, no DOM.

const here = dirname(fileURLToPath(import.meta.url));
const entryPath = join(here, "entry.txt");

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("error: MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

let raw: Buffer;
try {
  raw = readFileSync(entryPath);
} catch (err) {
  console.error(`error: cannot read entry.txt: ${(err as Error).message}`);
  process.exit(1);
}

let text: string;
try {
  text = new TextDecoder("utf-8", { fatal: true }).decode(raw);
} catch {
  console.error("error: entry.txt is not valid UTF-8");
  process.exit(1);
}

const length = [...text].length;
if (length < 1 || length > 200) {
  console.error(`error: entry must be 1-200 characters, got ${length}`);
  process.exit(1);
}
if (text.trim().length === 0) {
  console.error("error: entry must not be blank or only whitespace");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), text, "utf8");
