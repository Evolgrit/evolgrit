import fs from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "..", "i18n");
const sourcePath = path.join(root, "en.json");

function readJson(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function isPlainObject(value: unknown) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function merge(base: any, override: any): any {
  if (Array.isArray(base)) {
    return Array.isArray(override) ? override : base;
  }
  if (!isPlainObject(base)) {
    return override === undefined ? base : override;
  }

  const out: Record<string, any> = {};
  for (const key of Object.keys(base)) {
    const baseVal = base[key];
    const overrideVal = override ? override[key] : undefined;
    if (isPlainObject(baseVal)) {
      out[key] = merge(baseVal, isPlainObject(overrideVal) ? overrideVal : {});
    } else if (Array.isArray(baseVal)) {
      out[key] = Array.isArray(overrideVal) ? overrideVal : baseVal;
    } else {
      out[key] = overrideVal === undefined ? baseVal : overrideVal;
    }
  }

  if (override && typeof override === "object") {
    for (const key of Object.keys(override)) {
      if (!(key in out)) out[key] = override[key];
    }
  }

  return out;
}

const source = readJson(sourcePath);
const files = fs.readdirSync(root).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const filePath = path.join(root, file);
  const localeData = readJson(filePath);
  const merged = merge(source, localeData);
  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2) + "\n");
}

console.log(`[i18n-sync] synced ${files.length} locale files`);
