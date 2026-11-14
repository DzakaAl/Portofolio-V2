'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translations, apiTranslations, type Lang } from './translations';
import { getTranslations } from './api';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Translate a key; falls back to English, then to the raw key */
  t: (key: string) => string;
  /**
   * Translate dynamic API/database content at render time.
   * Manual overrides from `apiTranslations` take priority, then the
   * admin-managed dictionary from the backend `translations` table.
   * Falls back to the raw value — the DB content stays untouched.
   */
  tl: (text: string) => string;
}

const STORAGE_KEY = 'portfolio_lang';
const DB_TRANSLATIONS_CACHE_KEY = 'portfolio_db_translations_v1';

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
  tl: (text) => text,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');
  // EN -> ID dictionary fetched from the backend `translations` table
  const [dbMap, setDbMap] = useState<Record<string, string>>({});

  // Restore saved preference, or detect from the browser on first visit
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'id') {
      setLangState(saved);
    } else if (navigator.language?.toLowerCase().startsWith('id')) {
      setLangState('id');
    }
  }, []);

  // Keep <html lang> in sync for accessibility & SEO
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Load the admin-managed translation dictionary: paint instantly from the
  // localStorage cache, then revalidate from the API.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DB_TRANSLATIONS_CACHE_KEY);
      if (raw) setDbMap(JSON.parse(raw) as Record<string, string>);
    } catch {
      // corrupted cache — ignore, API fetch below will refresh it
    }

    getTranslations().then((map) => {
      if (Object.keys(map).length > 0) {
        setDbMap(map);
        try {
          window.localStorage.setItem(DB_TRANSLATIONS_CACHE_KEY, JSON.stringify(map));
        } catch {
          // storage full/blocked — in-memory map still works
        }
      }
    });
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key: string) => translations[lang][key] ?? translations.en[key] ?? key,
    [lang]
  );

  const tl = useCallback(
    (text: string) => {
      if (!text) return text;
      // Manual overrides win (e.g. curated UI strings stored in the DB)
      const entry = apiTranslations[text];
      if (entry) return entry[lang] ?? text;
      if (lang !== 'id') return text;
      return dbMap[text] ?? text;
    },
    [lang, dbMap]
  );

  const value = useMemo(() => ({ lang, setLang, t, tl }), [lang, setLang, t, tl]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
