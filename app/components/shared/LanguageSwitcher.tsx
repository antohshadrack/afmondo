"use client";

import { SegmentedControl } from "@mantine/core";
import { useTranslation } from "../../contexts/TranslationContext";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation() as any;

  return (
    <SegmentedControl
      value={locale || "fr"}
      onChange={(val) => setLocale && setLocale(val)}
      data={[
        { label: "FR", value: "fr" },
        { label: "EN", value: "en" },
      ]}
      size="xs"
      color="orange"
      radius="xl"
    />
  );
}
