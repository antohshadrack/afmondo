"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { flashSaleProducts as staticFlashSales, flashSaleEndTime } from "@/lib/data/flashsales";
import { useTranslation } from "../../contexts/TranslationContext";
import ProductCard from "../shared/ProductCard";
import {
  Box,
  Group,
  Text,
  SimpleGrid,
  Badge,
  Divider,
  Anchor,
} from "@mantine/core";
import { IconBolt } from "@tabler/icons-react";

import type { Product } from "../shared/ProductCard";

interface FlashSalesSectionProps {
  products?: Product[];
}

export default function FlashSalesSection({ products: propProducts }: FlashSalesSectionProps = {}) {
  const products = propProducts && propProducts.length > 0 ? propProducts : staticFlashSales;
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const updateTimer = () => {
      const now = new Date();
      const diff = flashSaleEndTime.getTime() - now.getTime();
      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [mounted]);

  const pad = (n: number) => String(n).padStart(2, "0");

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

            {/* Countdown */}
            <Group gap={4} align="center">
              <Text fz="sm" c="dimmed">{t("flashSales.timeLeft")}:</Text>
              <Group gap={2}>
                {[pad(timeLeft.hours), pad(timeLeft.minutes), pad(timeLeft.seconds)].map((val, i) => (
                  <Group key={i} gap={2}>
                    <Box
                      style={{
                        background: "linear-gradient(135deg, var(--afmondo-orange) 0%, #e5951a 100%)",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: 6,
                        fontWeight: 700,
                        fontVariantNumeric: "tabular-nums",
                        fontSize: 14,
                        minWidth: 34,
                        textAlign: "center",
                        boxShadow: "0 2px 8px rgba(245,166,35,0.3)",
                      }}
                    >
                      {val}
                    </Box>
                    {i < 2 && <Text fw={700} c="dark" fz="sm">:</Text>}
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
