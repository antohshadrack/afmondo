"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IconCar, IconTruck, IconDeviceDesktop, IconPrinter,
  IconDeviceTv, IconSofa, IconFridge, IconSettings,
  IconTool, IconTag, IconCategory, IconChevronRight,
} from "@tabler/icons-react";
import { Box, Text, UnstyledButton, Skeleton } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { DbCategory } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";

// Map common category name keywords → icon
function getIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("car") || n.includes("vehicle") || n.includes("auto")) return <IconCar size={16} />;
  if (n.includes("truck") || n.includes("tractor") || n.includes("farm")) return <IconTruck size={16} />;
  if (n.includes("tv") || n.includes("television")) return <IconDeviceTv size={16} />;
  if (n.includes("print")) return <IconPrinter size={16} />;
  if (n.includes("fridge") || n.includes("refrig") || n.includes("cool")) return <IconFridge size={16} />;
  if (n.includes("sofa") || n.includes("furniture") || n.includes("home")) return <IconSofa size={16} />;
  if (n.includes("electron") || n.includes("computer") || n.includes("digital")) return <IconDeviceDesktop size={16} />;
  if (n.includes("kitchen") || n.includes("appliance")) return <IconSettings size={16} />;
  if (n.includes("machine") || n.includes("industrial") || n.includes("tool")) return <IconTool size={16} />;
  if (n.includes("deal") || n.includes("sale") || n.includes("promo")) return <IconTag size={16} />;
  return <IconCategory size={16} />;
}

const heroSlides = [
  { image: "/images/hero/slide-1.jpg", key: "slide1" },
  { image: "/images/hero/slide-2.jpg", key: "slide2" },
  { image: "/images/hero/slide-3.jpg", key: "slide3" },
  { image: "/sliders/PrintLikeaPro.jpg", key: "slide4" },
];

interface CategoryShowcaseProps {
  /** Pre-fetched categories (from server component). Falls back to client fetch if not provided. */
  categories?: DbCategory[];
}

export default function CategoryShowcase({ categories: propCategories }: CategoryShowcaseProps = {}) {
  const autoplay = useRef(Autoplay({ delay: 2500 }));
  const [categories, setCategories] = useState<DbCategory[]>(propCategories ?? []);
  const [loading, setLoading] = useState(!propCategories);

  useEffect(() => {
    if (propCategories) return; // already have data from server
    const supabase = createClient();
    supabase
      .from("categories")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        setCategories(data ?? []);
        setLoading(false);
      });
  }, []);

  // Build href from slug (top-level → /slug, child → /parent-slug/slug)
  const getHref = (cat: DbCategory) => `/${cat.slug}`;

  return (
    <>
      <style>{`
        .cat-nav-item { transition: background 120ms, color 120ms; }
        .cat-nav-item:hover { background: var(--mantine-color-orange-0) !important; color: var(--afmondo-orange) !important; }
        .cat-nav-item:hover .cat-nav-icon { color: var(--afmondo-orange); }
        .cat-pill:hover { background: var(--mantine-color-orange-0) !important; border-color: var(--mantine-color-orange-4) !important; color: var(--afmondo-orange) !important; }
        .afmondo-carousel [data-active] { background-color: var(--afmondo-orange) !important; width: 24px !important; border-radius: 4px !important; }
      `}</style>

      <Box component="section" py={{ base: "sm", lg: "md" }} bg="white">
        <Box px={{ base: "md", lg: "xl" }} maw={1400} mx="auto">

          {/* ── Mobile: horizontal scrolling pills ── */}
          <Box hiddenFrom="lg" mb="md" className="hide-scrollbar" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <Box style={{ display: "flex", gap: 6, paddingBottom: 4, width: "max-content" }}>
              {loading
                ? Array(6).fill(0).map((_, i) => <Skeleton key={i} height={34} width={100} radius="md" />)
                : categories.map((cat) => (
                  <UnstyledButton
                    key={cat.id}
                    component={Link}
                    href={getHref(cat)}
                    className="cat-pill"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "6px 12px", borderRadius: 6,
                      border: "1px solid var(--mantine-color-gray-3)",
                      backgroundColor: "white", fontSize: 12, fontWeight: 500,
                      color: "var(--mantine-color-dark-6)", whiteSpace: "nowrap",
                      flexShrink: 0, transition: "all 120ms",
                    }}
                  >
                    <Box style={{ color: "var(--mantine-color-gray-5)", display: "flex", alignItems: "center" }}>
                      {getIcon(cat.name)}
                    </Box>
                    {cat.name}
                  </UnstyledButton>
                ))
              }
            </Box>
          </Box>

          {/* ── Desktop: 3-col grid ── */}
          <Box visibleFrom="lg" style={{ display: "grid", gridTemplateColumns: "220px 1fr 200px", gap: 12 }}>
            {/* Left sidebar */}
            <Box style={{ border: "1px solid var(--mantine-color-gray-2)", borderRadius: 8, overflow: "hidden" }}>
              <Box px="sm" py={10} style={{ borderBottom: "2px solid var(--afmondo-orange)", backgroundColor: "var(--mantine-color-dark-8)" }}>
                <Text fz="xs" fw={700} tt="uppercase" c="white" style={{ letterSpacing: 1.5 }}>Categories</Text>
              </Box>

              {loading
                ? Array(8).fill(0).map((_, i) => (
                  <Box key={i} px="sm" py="xs" style={{ borderBottom: "1px solid var(--mantine-color-gray-1)" }}>
                    <Skeleton height={18} width="80%" radius="sm" />
                  </Box>
                ))
                : categories.map((cat) => (
                  <UnstyledButton
                    key={cat.id}
                    component={Link}
                    href={getHref(cat)}
                    className="cat-nav-item"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      width: "100%", padding: "9px 12px",
                      borderBottom: "1px solid var(--mantine-color-gray-1)",
                      backgroundColor: "white", color: "var(--mantine-color-dark-7)", textDecoration: "none",
                    }}
                  >
                    <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Box className="cat-nav-icon" style={{ color: "var(--mantine-color-gray-5)", display: "flex", alignItems: "center" }}>
                        {getIcon(cat.name)}
                      </Box>
                      <Text fz="sm" fw={500} style={{ lineHeight: 1 }}>{cat.name}</Text>
                    </Box>
                    {cat.parent_id === null && (
                      <IconChevronRight size={13} style={{ color: "var(--mantine-color-gray-4)", flexShrink: 0 }} />
                    )}
                  </UnstyledButton>
                ))
              }
            </Box>

            {/* Center: Hero Carousel */}
            <Box style={{ borderRadius: 8, overflow: "hidden" }}>
              <Carousel
                className="afmondo-carousel"
                withIndicators
                withControls={false}
                emblaOptions={{ loop: true }}
                plugins={[autoplay.current]}
                onMouseEnter={autoplay.current.stop}
                onMouseLeave={autoplay.current.reset}
                height={400}
                styles={{
                  root: { height: 400 },
                  indicator: { width: 8, height: 8, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.4)" },
                  indicators: { bottom: 14 },
                }}
              >
                {heroSlides.map((slide, idx) => (
                  <Carousel.Slide key={slide.key}>
                    <Box pos="relative" style={{ height: 400, width: "100%" }}>
                      <Image src={slide.image} alt={`Slide ${idx + 1}`} fill style={{ objectFit: "cover" }} priority={idx === 0} />
                      <Box pos="absolute" style={{ inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.52) 0%, transparent 55%)" }} />
                    </Box>
                  </Carousel.Slide>
                ))}
              </Carousel>
            </Box>

            {/* Right: promo panels */}
            <Box style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Box
                component={Link}
                href="/deals/flash-sales"
                style={{ flex: 1, display: "block", borderRadius: 8, overflow: "hidden", position: "relative" }}
              >
                <video autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}>
                  <source src="/big_sale.mp4" type="video/mp4" />
                </video>
              </Box>
              <Box
                component={Link}
                href="/electronics/printing-machines"
                style={{ flex: 1, display: "block", borderRadius: 8, overflow: "hidden", backgroundColor: "var(--mantine-color-gray-1)", position: "relative", border: "1px solid var(--mantine-color-gray-2)" }}
              >
                <Image src="/products/Epson_L3250.jpg" alt="Epson Printer" fill style={{ objectFit: "contain", padding: 12 }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
