"use client";

import React from "react";
import Link from "next/link";
import {
  Box,
  Group,
  Text,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { IconChevronRight } from "@tabler/icons-react";
import { useTranslation } from "../../contexts/TranslationContext";
import ProductCard, { type Product } from "../shared/ProductCard";

interface ProductCarouselProps {
  title: string;
  products: Product[];
  viewAllLink: string;
}

export default function ProductCarousel({ title, products, viewAllLink }: ProductCarouselProps) {
  const { t } = useTranslation();

  return (
    <Box component="section" py={{ base: "md", lg: "xl" }} bg="white">
      <Box px={{ base: "md", lg: "xl" }} maw={1400} mx="auto">
        {/* Section Header */}
        <Group justify="space-between" align="flex-end" mb="lg" style={{ borderBottom: "1px solid var(--mantine-color-gray-2)", paddingBottom: 10 }}>
          <Text fz={{ base: "xl", md: "2xl" }} fw={800} c="dark" style={{ letterSpacing: -0.5 }}>
            {title}
          </Text>
          <Text
            component={Link}
            href={viewAllLink}
            fz="sm"
            fw={500}
            c="dimmed"
            style={{ display: "flex", alignItems: "center", gap: 4, textDecoration: "none", whiteSpace: "nowrap" }}
          >
            {t("common.viewAll")} →
          </Text>
        </Group>


        {/* Carousel */}
        <Carousel
          slideSize={{ base: 180, sm: 210, md: 220 }}
          slideGap="md"
          withControls
          emblaOptions={{ dragFree: true, loop: false }}
          styles={{
            control: {
              backgroundColor: "white",
              border: "1px solid var(--mantine-color-gray-3)",
              boxShadow: "var(--mantine-shadow-sm)",
              "&:hover": {
                backgroundColor: "var(--mantine-color-gray-0)",
              },
            },
            controls: {
              top: "40%",
            },
          }}
        >
          {products.map((product) => (
            <Carousel.Slide key={product.id}>
              <ProductCard
                product={product}
                variant="carousel"
                size="full"
                showActionButtons={true}
                showBrand={true}
                textAlign="left"
                accentColor="orange"
              />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Box>
    </Box>
  );
}
