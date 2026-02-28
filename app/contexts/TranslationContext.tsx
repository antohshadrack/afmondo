"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import enMessages from '@/messages/en.json';
import frMessages from '@/messages/fr.json';

type Messages = typeof enMessages;
type Locale = 'en' | 'fr';

interface TranslationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  messages: Messages;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const translations: Record<Locale, Messages> = {
  en: enMessages,
  fr: frMessages,
};

const STORAGE_KEY = 'afmondo-locale';

export function TranslationProvider({ children }: { children: ReactNode }) {
  // Default to French for Senegal; restore from localStorage on mount
  const [locale, setLocaleState] = useState<Locale>('fr');

  // Hydrate from localStorage after mount (avoid SSR mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && (saved === 'en' || saved === 'fr')) {
        setLocaleState(saved);
      }
    } catch {
      // localStorage unavailable (private browsing etc.) — stay on default
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {
      // ignore
    }
  };

  const messages = translations[locale];

  // Supports nested keys like "hero.title"
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = messages;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[i18n] Missing key "${key}" for locale "${locale}"`);
        }
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  };

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t, messages }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
