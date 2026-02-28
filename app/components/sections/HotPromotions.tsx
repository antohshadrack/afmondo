"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IconDeviceLaptop,
  IconPackage,
  IconDeviceGamepad2,
  IconTag,
  IconPrinter,
  IconDeviceDesktop,
  IconChevronRight,
} from "@tabler/icons-react";
import { useTranslation } from "../../contexts/TranslationContext";
import {
  Box,
  SimpleGrid,
  Paper,
  Text,
  Group,
  Title,
  ThemeIcon,
  Anchor,
} from "@mantine/core";

interface PromotionCategory {
  id: string;
  name: string;
  href: string;
  icon: React.ReactNode;
  gradient: { from: string; to: string };
  iconColor: string;
}

const promotions: PromotionCategory[] = [
  {
    id: "1",
    name: "Student Deals",
    href: "/deals/student",
    icon: <IconDeviceLaptop size={36} />,
    gradient: { from: "yellow.0", to: "yellow.1" },
    iconColor: "yellow",
  },
  {
    id: "2",
    name: "Featured Products",
    href: "/featured",
    icon: <IconPackage size={36} />,
    gradient: { from: "green.0", to: "green.1" },
    iconColor: "green",
  },
  {
    id: "3",
    name: "Gaming Deals",
    href: "/deals/gaming",
    icon: <IconDeviceGamepad2 size={36} />,
    gradient: { from: "blue.0", to: "blue.1" },
    iconColor: "blue",
  },
  {
    id: "4",
    name: "Special Offers",
    href: "/deals/special",
    icon: <IconTag size={36} />,
    gradient: { from: "pink.0", to: "pink.1" },
    iconColor: "pink",
  },
  {
    id: "5",
    name: "Office Printers",
    href: "/electronics/printers",
    icon: <IconPrinter size={36} />,
    gradient: { from: "violet.0", to: "violet.1" },
    iconColor: "violet",
  },
  {
    id: "6",
    name: "All-in-One Desktops",
    href: "/electronics/desktops",
    icon: <IconDeviceDesktop size={36} />,
    gradient: { from: "cyan.0", to: "cyan.1" },
    iconColor: "cyan",
  },
];

export default function HotPromotions() {
  const { t } = useTranslation();

  return (
    <Box component="section" py={{ base: "md", lg: "xl" }} bg="gray.0">
      <Box px={{ base: "md", lg: "xl" }} maw={1400} mx="auto">
        {/* Section Header */}
        <Group justify="space-between" align="center" mb="lg">
          <Title order={2} fz={{ base: "xl", md: "2xl" }} fw={700} c="dark">
            Hot Promotions
          </Title>
          <Anchor
            component={Link}
            href="/promotions"
            fz="sm"
            fw={600}
            c="blue"
            style={{ display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}
          >
            {t("common.viewAll")}
            <IconChevronRight size={16} />
          </Anchor>
        </Group>

        {/* Promotions Grid */}
        <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} spacing={{ base: "sm", md: "md" }}>
          {promotions.map((promo) => (
            <Paper
              key={promo.id}
              component={Link}
              href={promo.href}
              withBorder
              radius="lg"
              p="lg"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                minHeight: 160,
                textDecoration: "none",
                background: `linear-gradient(135deg, var(--mantine-color-${promo.gradient.from}) 0%, var(--mantine-color-${promo.gradient.to}) 100%)`,
                transition: "transform 200ms ease, box-shadow 200ms ease",
                cursor: "pointer",
              }}
              styles={{
                root: {
                  "&:hover": {
                    transform: "scale(1.04)",
                    boxShadow: "var(--mantine-shadow-lg)",
                  },
                },
              }}
            >
              <ThemeIcon
                color={promo.iconColor}
                variant="light"
                size={64}
                radius="xl"
                mb="sm"
              >
                {promo.icon}
              </ThemeIcon>
              <Text fz="sm" fw={600} c="dark">
                {promo.name}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
