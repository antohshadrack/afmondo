"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Title,
  Text,
  SimpleGrid,
  Group,
  Badge,
  Paper,
  Stack,
  ThemeIcon,
  Breadcrumbs,
  Anchor,
} from "@mantine/core";
import { IconChevronRight, IconBolt } from "@tabler/icons-react";
import { flashSaleProducts } from "@/lib/data/flashsales";
import ProductCard from "@/app/components/shared/ProductCard";
import Header from "@/app/components/shared/header";
import Footer from "@/app/components/sections/Footer";
import { useTranslation } from "@/app/contexts/TranslationContext";

/* ── Countdown timer ──────────────────────────────────────── */
function useCountdown(targetHours = 8) {
  const endTime = useRef(Date.now() + targetHours * 3600 * 1000);
  const [remaining, setRemaining] = useState(targetHours * 3600);

  useEffect(() => {
    const tick = () => {
      const secs = Math.max(0, Math.floor((endTime.current - Date.now()) / 1000));
      setRemaining(secs);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const h = String(Math.floor(remaining / 3600)).padStart(2, "0");
  const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
  const s = String(remaining % 60).padStart(2, "0");
  return { h, m, s, remaining };
}

function TimeUnit({ value, label }: { value: string; label: string }) {
  return (
    <Stack align="center" gap={2}>
      <Paper
        radius="md"
        style={{
          backgroundColor: "var(--mantine-color-orange-6)",
          color: "white",
          fontWeight: 800,
          fontSize: 28,
          lineHeight: 1,
          padding: "10px 14px",
          minWidth: 56,
          textAlign: "center",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </Paper>
      <Text fz="xs" c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }}>{label}</Text>
    </Stack>
  );
}

export default function FlashSalesPage() {
  const { t } = useTranslation();
  const { h, m, s } = useCountdown(8);

  return (
    <Box style={{ minHeight: "100vh" }} bg="gray.0">
      <Header />

      {/* Breadcrumb */}
      <Box bg="white" style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}>
        <Container size="xl" py="sm">
          <Breadcrumbs separator={<IconChevronRight size={14} />}>
            <Anchor component={Link} href="/" fz="sm" c="dimmed">Home</Anchor>
            <Text fz="sm" fw={500} c="dark">{t("flashSales.title")}</Text>
          </Breadcrumbs>
        </Container>
      </Box>

      <Container size="xl" py={{ base: "md", md: "xl" }}>
        {/* Hero banner */}
        <Paper
          radius="xl"
          mb="xl"
          p={{ base: "lg", md: "xl" }}
          style={{
            background: "linear-gradient(135deg, #FF6B35 0%, #F5A623 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <Box
            pos="absolute"
            style={{
              width: 300, height: 300,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              top: -100, right: -60,
            }}
          />
          <Box
            pos="absolute"
            style={{
              width: 180, height: 180,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              bottom: -60, left: 40,
            }}
          />

          <Group align="center" justify="space-between" wrap="wrap" gap="lg" pos="relative">
            <Box>
              <Group gap="sm" mb="xs">
                <ThemeIcon size={32} radius="xl" color="white" variant="filled" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                  <IconBolt size={18} color="white" />
                </ThemeIcon>
                <Badge color="white" variant="filled" fw={700} style={{ color: "var(--mantine-color-orange-6)" }}>
                  LIMITED TIME
                </Badge>
              </Group>
              <Title order={1} c="white" fz={{ base: "2xl", md: "3xl" }} fw={800} lh={1.2}>
                {t("flashSales.title")}
              </Title>
              <Text c="rgba(255,255,255,0.85)" fz="sm" mt="xs">
                Grab these deals before they're gone!
              </Text>
            </Box>

            {/* Timer */}
            <Box>
              <Text c="rgba(255,255,255,0.8)" fz="xs" tt="uppercase" mb="xs" style={{ letterSpacing: 1 }}>
                {t("flashSales.timeLeft")}
              </Text>
              <Group gap="xs" align="flex-start">
                <TimeUnit value={h} label="hrs" />
                <Text c="white" fw={800} fz="xl" style={{ marginTop: 8 }}>:</Text>
                <TimeUnit value={m} label="min" />
                <Text c="white" fw={800} fz="xl" style={{ marginTop: 8 }}>:</Text>
                <TimeUnit value={s} label="sec" />
              </Group>
            </Box>
          </Group>
        </Paper>

        {/* Products */}
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="md">
          {flashSaleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product as any}
              variant="flash-sale"
              size="full"
              accentColor="red"
              showProgressBar
              showItemsLeft
            />
          ))}
        </SimpleGrid>
      </Container>

      <Footer />
    </Box>
  );
}
