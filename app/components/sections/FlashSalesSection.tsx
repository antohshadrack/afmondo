"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslation } from "../../contexts/TranslationContext";
import ProductCard from "../shared/ProductCard";
import {
  Box,
  Group,
  Text,
  SimpleGrid,
  Anchor,
} from "@mantine/core";
import { IconBolt } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import { mapDbProduct } from "@/lib/supabase/queries";

import type { Product } from "../shared/ProductCard";

interface FlashSalesSectionProps {
  products?: Product[];
  /** ISO timestamp from DB flash_sale_ends — overrides the static fallback */
  saleEndsAt?: string;
}

export default function FlashSalesSection({ products: initialProducts = [], saleEndsAt }: FlashSalesSectionProps) {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Use DB timestamp if available; otherwise default to 24 h from now
    const endTime = saleEndsAt ? new Date(saleEndsAt) : new Date(Date.now() + 24 * 60 * 60 * 1000);
    const updateTimer = () => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [mounted, saleEndsAt]);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    const sb = createClient();
    const ch = sb.channel("storefront-flash-sales")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, async () => {
        const { data } = await sb.from("products")
          .select("id, name, slug, price, original_price, discount, images, brand, is_active, is_flash_sale, flash_sale_ends, category_id, description, created_at")
          .eq("is_active", true)
          .eq("is_flash_sale", true)
          .order("created_at", { ascending: false })
          .limit(8);
        if (data) setProducts(data.map(mapDbProduct as any));
      }).subscribe();
    return () => { sb.removeChannel(ch); };
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  // Don't render if there are no products from Supabase
  if (products.length === 0) return null;

  return (
    <Box
      component="section"
      py={{ base: "md", lg: "xl" }}
      mt={{ base: "xl", md: "2xl" }}
      bg="white"
      style={{ borderTop: "3px solid var(--afmondo-orange)" }}
    >
      <Box px={{ base: "md", lg: "xl" }} maw={1400} mx="auto">
        {/* Header */}
        <Group justify="space-between" align="center" mb="lg" wrap="wrap" gap="sm">
          <Group gap="md" align="center">
            <Group gap="xs" align="center">
              <IconBolt size={28} color="var(--mantine-color-orange-5)" />
              <Text fz={{ base: "xl", md: "2xl" }} fw={800} c="dark">
                {t("flashSales.title")}
              </Text>
            </Group>

            {/* Countdown: D : HH : MM : SS */}
            <Group gap={4} align="center">
              <Text fz="sm" c="dimmed">{t("flashSales.timeLeft")}:</Text>
              <Group gap={2}>
                {[
                  { val: String(timeLeft.days), label: "D" },
                  { val: pad(timeLeft.hours), label: "H" },
                  { val: pad(timeLeft.minutes), label: "M" },
                  { val: pad(timeLeft.seconds), label: "S" },
                ].map(({ val, label }, i) => (
                  <Group key={i} gap={2} align="flex-end">
                    <Box
                      style={{
                        background: "linear-gradient(135deg, var(--afmondo-orange) 0%, #e5951a 100%)",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: 6,
                        fontWeight: 700,
                        fontVariantNumeric: "tabular-nums",
                        fontSize: 14,
                        minWidth: label === "D" ? 28 : 34,
                        textAlign: "center",
                        boxShadow: "0 2px 8px rgba(245,166,35,0.3)",
                      }}
                    >
                      {val}
                    </Box>
                    <Text fz={10} c="dimmed" fw={600} mb={3}>{label}</Text>
                    {i < 3 && <Text fw={700} c="dark" fz="sm" mb={1}>:</Text>}
                  </Group>
                ))}
              </Group>
            </Group>
          </Group>

          <Anchor
            component={Link}
            href="/flash-sales"
            fz="sm"
            fw={600}
            c="orange.6"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
          >
            {t("common.viewAll")} ›
          </Anchor>
        </Group>

        {/* Products Grid */}
        <SimpleGrid
          cols={{ base: 2, sm: 3, md: 4, lg: 6 }}
          spacing="md"
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="flash-sale"
              size="full"
              showActionButtons={true}
              showProgressBar={true}
              showItemsLeft={true}
              accentColor="red"
            />
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
