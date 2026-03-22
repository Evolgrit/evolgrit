import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..");
const TARGET_DIRS = ["app", "components"].map((p) => path.join(ROOT, p));
const EXT = new Set([".ts", ".tsx"]);

function walk(dir: string, out: string[] = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (EXT.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

const TEXT_RE = /<Text[^>]*>([^<{\n}][^<\n]*)<\/Text>/g;

let found = 0;
for (const dir of TARGET_DIRS) {
  const files = walk(dir);
  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");
    let match: RegExpExecArray | null;
    while ((match = TEXT_RE.exec(src))) {
      const literal = match[1].trim();
      if (!literal) continue;
      if (literal.startsWith("{") || literal.includes("t(")) continue;
      if (/^[\d\W]+$/.test(literal)) continue;
      const idx = match.index;
      const line = src.slice(0, idx).split("\n").length;
      console.log(`${path.relative(ROOT, file)}:${line} -> ${literal}`);
      found += 1;
    }
  }
}

if (found > 0) {
  console.error(`\n[i18n-scan] Found ${found} potential hardcoded UI strings.`);
  process.exitCode = 1;
} else {
  console.log("[i18n-scan] No hardcoded UI strings detected.");
}
