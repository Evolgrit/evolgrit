// lib/i18n.tsx
// Evolgrit i18n: Provider + useT hook + fallback + missing-key dedupe + system locale (expo-localization)
// UI language = uiLocale (system|explicit), learning language stays separate.

import React, { createContext, useCallback, useContext, useMemo } from "react";
import * as Localization from "expo-localization";

// ✅ Import all dictionaries (must exist; i18n:sync ensures full key coverage)
import en from "../i18n/en.json";
import de from "../i18n/de.json";
import ar from "../i18n/ar.json";
import uk from "../i18n/uk.json";
import tr from "../i18n/tr.json";
import pl from "../i18n/pl.json";
import ro from "../i18n/ro.json";
import vi from "../i18n/vi.json";
import ur from "../i18n/ur.json";
import bn from "../i18n/bn.json";
import hi from "../i18n/hi.json";
import id from "../i18n/id.json";

export type UiLocale =
  | "system"
  | "en"
  | "de"
  | "ar"
  | "uk"
  | "tr"
  | "pl"
  | "ro"
  | "vi"
  | "ur"
  | "bn"
  | "hi"
  | "id";

type Dict = Record<string, any>;

const DICTS: Record<string, Dict> = {
  en,
  de,
  ar,
  uk,
  tr,
  pl,
  ro,
  vi,
  ur,
  bn,
  hi,
  id,
};

const RTL_LOCALES = new Set(["ar", "ur"]);

function normalizeLocale(raw: string | undefined | null): string {
  if (!raw) return "en";
  // "en-US" -> "en", "pt_BR" -> "pt"
  const cleaned = raw.replace("_", "-").toLowerCase();
  const base = cleaned.split("-")[0];
  return DICTS[base] ? base : "en";
}

function getSystemLocale(): string {
  try {
    const locales = Localization.getLocales?.();
    const first = Array.isArray(locales) && locales.length ? locales[0] : undefined;
    return normalizeLocale((first as any)?.languageTag || (first as any)?.languageCode);
  } catch {
    return "en";
  }
}

function deepGet(obj: any, key: string): any {
  // supports dotted keys: "profile.settings_sub"
  if (obj && typeof obj === "object" && key in obj) return obj[key];
  const parts = key.split(".");
  let cur = obj;
  for (const p of parts) {
    if (!cur || typeof cur !== "object" || !(p in cur)) return undefined;
    cur = cur[p];
  }
  return cur;
}

function interpolate(str: string, params?: Record<string, string | number>): string {
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
}

const warned = new Set<string>(); // locale:key -> once

export type TFunction = (key: string, params?: Record<string, string | number>) => string;

type I18nContextValue = {
  locale: string; // resolved (not "system")
  uiLocale: UiLocale;
  isRTL: boolean;
  t: TFunction;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  uiLocale,
  children,
}: {
  uiLocale: UiLocale;
  children: React.ReactNode;
}) {
  const resolved = uiLocale === "system" ? getSystemLocale() : normalizeLocale(uiLocale);

  const isRTL = RTL_LOCALES.has(resolved);

  // Note: forceRTL usually requires restart to fully apply. We do NOT auto-force here
  // to avoid runtime layout issues. Handle it in a dedicated settings flow if desired.
  // (If you DO want to force: I18nManager.forceRTL(isRTL))

  const t = useCallback<TFunction>(
    (key, params) => {
      // locale first, then en fallback, then key
      const dict = DICTS[resolved] ?? DICTS.en;
      let val = deepGet(dict, key);
      if (val === undefined) val = deepGet(DICTS.en, key);

      if (val === undefined) {
        if (__DEV__) {
          const k = `${resolved}:${key}`;
          if (!warned.has(k)) {
            warned.add(k);
            console.warn("[i18n] missing key", { key, locale: resolved });
          }
        }
        return key;
      }

      if (typeof val !== "string") return String(val);
      return interpolate(val, params);
    },
    [resolved]
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale: resolved, uiLocale, isRTL, t }),
    [resolved, uiLocale, isRTL, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useT() {
  return useI18n().t;
}
