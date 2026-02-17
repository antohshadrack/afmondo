"use client";

import { useTranslation } from '../../contexts/TranslationContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <Globe size={18} className="text-gray-600" />
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as 'en' | 'fr')}
        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-afmondo-green"
      >
        <option value="fr">Français</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
