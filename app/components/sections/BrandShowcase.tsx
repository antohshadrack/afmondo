"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "../../contexts/TranslationContext";
import {
  Box,
  SimpleGrid,
  Paper,
  Text,
  Group,
  Title,
  Anchor,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";

interface Brand {
  id: string;
  name: string;
  href: string;
}

const brands: Brand[] = [
  { id: "1", name: "Toyota", href: "/brands/toyota" },
  { id: "2", name: "Honda", href: "/brands/honda" },
  { id: "3", name: "Nissan", href: "/brands/nissan" },
  { id: "4", name: "Samsung", href: "/brands/samsung" },
  { id: "5", name: "LG", href: "/brands/lg" },
  { id: "6", name: "Sony", href: "/brands/sony" },
  { id: "7", name: "IKEA", href: "/brands/ikea" },
  { id: "8", name: "Ashley", href: "/brands/ashley" },
  { id: "9", name: "Bosch", href: "/brands/bosch" },
  { id: "10", name: "Whirlpool", href: "/brands/whirlpool" },
  { id: "11", name: "Caterpillar", href: "/brands/caterpillar" },
  { id: "12", name: "John Deere", href: "/brands/johndeere" },
];

export default function BrandShowcase() {
  const { t } = useTranslation();

  return (
    <Box
      component="section"
      py={{ base: "md", lg: "xl" }}
      style={{
        background: "linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)",
      }}
    >
      <Box px={{ base: "md", lg: "xl" }} maw={1400} mx="auto">
        {/* Header */}
        <Group justify="space-between" align="center" mb="lg">
          <Title order={2} fz={{ base: "xl", md: "2xl" }} fw={700} c="dark">
            {t("brands.title")}
          </Title>
          <Anchor
            component={Link}
            href="/brands"
            fz="sm"
            fw={600}
            c="orange"
            style={{ display: "flex", alignItems: "center", gap: 4, textDecoration: "none" }}
          >
            {t("common.viewAll")}
            <IconChevronRight size={16} />
          </Anchor>
        </Group>

        {/* Brands Grid */}
        <SimpleGrid
          cols={{ base: 2, sm: 3, md: 4, lg: 6 }}
          spacing="md"
        >
          {brands.map((brand) => (
            <Paper
              key={brand.id}
              component={Link}
              href={brand.href}
              withBorder
              radius="md"
              p="md"
              style={{
                aspectRatio: "3/2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                textDecoration: "none",
                transition: "transform 200ms ease, box-shadow 200ms ease",
                cursor: "pointer",
              }}
              styles={{
                root: {
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "var(--mantine-shadow-lg)",
                  },
                },
              }}
            >
              {/* Corner decoration */}
              <Box
                pos="absolute"
                top={0}
                right={0}
                style={{
                  width: 0,
                  height: 0,
                  borderTop: "32px solid var(--mantine-color-blue-1)",
                  borderLeft: "32px solid transparent",
                  opacity: 0.6,
                }}
              />
              <Text
                className="brand-name"
                fz={{ base: "lg", sm: "xl" }}
                fw={700}
                c="gray.7"
                style={{ transition: "color 200ms", position: "relative", zIndex: 1 }}
              >
                {brand.name}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
