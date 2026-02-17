"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
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

export function TranslationProvider({ children }: { children: ReactNode }) {
  // Default to French for Senegal
  const [locale, setLocale] = useState<Locale>('fr');
  const messages = translations[locale];

  // Simple translation function - supports nested keys like "hero.title"
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = messages;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key "${key}" not found for locale "${locale}"`);
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
