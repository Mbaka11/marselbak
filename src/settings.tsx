import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "./content";

export type Mode = "day" | "night";

type Settings = {
  lang: Lang;
  mode: Mode;
  setLang: (l: Lang) => void;
  setMode: (m: Mode) => void;
};

const Ctx = createContext<Settings | null>(null);

function read<T extends string>(key: string, allowed: T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key) as T | null;
    if (v && allowed.includes(v)) return v;
  } catch {
    /* storage unavailable */
  }
  return fallback;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const browserLang: Lang = navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en";
  const [lang, setLang] = useState<Lang>(() => read<Lang>("lang", ["en", "fr"], browserLang));
  // Day (pro page) is always the default entry point.
  const [mode, setMode] = useState<Mode>(() => read<Mode>("mode", ["day", "night"], "day"));

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("lang", lang);
      localStorage.setItem("mode", mode);
    } catch {
      /* ignore */
    }
  }, [lang, mode]);

  return <Ctx.Provider value={{ lang, mode, setLang, setMode }}>{children}</Ctx.Provider>;
}

export function useSettings() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSettings outside provider");
  return v;
}
