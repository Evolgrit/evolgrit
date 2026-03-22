import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..");
const I18N_PATH = path.join(ROOT, "i18n", "en.json");
const TARGET_DIRS = ["app", "components"].map((p) => path.join(ROOT, p));
const EXT = new Set([".ts", ".tsx"]);

function readJson(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function deepGet(obj: any, key: string) {
  const parts = key.split(".");
  let cur = obj;
  for (const p of parts) {
    if (!cur || typeof cur !== "object" || !(p in cur)) return undefined;
    cur = cur[p];
  }
  return cur;
}

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

const dict = readJson(I18N_PATH);
const keyRegex = /\bt\(\s*["'`]([^"'`]+)["'`]/g;
const missing = new Map<string, Set<string>>();

for (const dir of TARGET_DIRS) {
  const files = walk(dir);
  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");
    let match: RegExpExecArray | null;
    while ((match = keyRegex.exec(src))) {
      const key = match[1];
      if (!key) continue;
      if (key.includes("${")) continue;
      if (deepGet(dict, key) === undefined) {
        const rel = path.relative(ROOT, file);
        if (!missing.has(rel)) missing.set(rel, new Set());
        missing.get(rel)!.add(key);
      }
    }
  }
}

if (missing.size > 0) {
  console.error("[i18n-validate] Missing keys in en.json:");
  for (const [file, keys] of missing.entries()) {
    for (const key of keys) {
      console.error(`- ${file}: ${key}`);
    }
  }
  process.exit(1);
} else {
  console.log("[i18n-validate] All t(\"...\") keys exist in en.json");
}
