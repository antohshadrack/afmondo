"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IconCar,
  IconTruck,
  IconDeviceDesktop,
  IconPrinter,
  IconDeviceTv,
  IconSofa,
  IconFridge,
  IconSettings,
  IconTool,
  IconTag,
  IconChevronRight,
} from "@tabler/icons-react";
import { Box, Text, UnstyledButton } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useTranslation } from "../../contexts/TranslationContext";

const categories = [
  { name: "categories.vehicles",          href: "/vehicles",                      icon: <IconCar size={16} />,           hasSubmenu: true  },
  { name: "categories.tractorsFarm",      href: "/vehicles/tractors",             icon: <IconTruck size={16} />,         hasSubmenu: true  },
  { name: "categories.electronics",       href: "/electronics",                   icon: <IconDeviceDesktop size={16} />, hasSubmenu: true  },
  { name: "categories.printingMachines",  href: "/electronics/printing-machines", icon: <IconPrinter size={16} />,       hasSubmenu: false },
  { name: "categories.televisions",       href: "/electronics/tvs",               icon: <IconDeviceTv size={16} />,      hasSubmenu: false },
  { name: "categories.furniture",         href: "/furniture",                     icon: <IconSofa size={16} />,          hasSubmenu: true  },
  { name: "categories.refrigerators",     href: "/appliances/refrigerators",      icon: <IconFridge size={16} />,        hasSubmenu: false },
  { name: "categories.kitchenAppliances", href: "/appliances/kitchen",            icon: <IconSettings size={16} />,      hasSubmenu: false },
  { name: "categories.industrialMachinery",href: "/machinery/industrial",         icon: <IconTool size={16} />,          hasSubmenu: false },
  { name: "categories.specialDeals",      href: "/deals",                         icon: <IconTag size={16} />,           hasSubmenu: false },
];

const heroSlides = [
  { image: "/images/hero/slide-1.jpg",      key: "slide1" },
  { image: "/images/hero/slide-2.jpg",      key: "slide2" },
  { image: "/images/hero/slide-3.jpg",      key: "slide3" },
  { image: "/sliders/PrintLikeaPro.jpg",    key: "slide4" },
];

export default function CategoryShowcase() {
  const { t } = useTranslation();
  const autoplay = useRef(Autoplay({ delay: 2500 }));

  return (
    <>
      <style>{`
        .cat-nav-item { transition: background 120ms, color 120ms; }
        .cat-nav-item:hover { background: var(--mantine-color-orange-0) !important; color: var(--afmondo-orange) !important; }
        .cat-nav-item:hover .cat-nav-icon { color: var(--afmondo-orange); }
        .cat-pill:hover { background: var(--mantine-color-orange-0) !important; border-color: var(--mantine-color-orange-4) !important; color: var(--afmondo-orange) !important; }
        .afmondo-carousel [data-active] { background-color: var(--afmondo-orange) !important; width: 24px !important; border-radius: 4px !important; }
        .afmondo-carousel-sm [data-active] { background-color: var(--afmondo-orange) !important; width: 18px !important; border-radius: 3px !important; }
      `}</style>

      <Box component="section" py={{ base: "sm", lg: "md" }} bg="white">
        <Box px={{ base: "md", lg: "xl" }} maw={1400} mx="auto">

          {/* ── Mobile: horizontal scrolling category pills ── */}
          <Box
            hiddenFrom="lg"
            mb="md"
            className="hide-scrollbar"
            style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}
          >
            <Box style={{ display: "flex", gap: 6, paddingBottom: 4, width: "max-content" }}>
              {categories.map((cat, idx) => (
                <UnstyledButton
                  key={idx}
                  component={Link}
                  href={cat.href}
                  className="cat-pill"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: "1px solid var(--mantine-color-gray-3)",
                    backgroundColor: "white",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--mantine-color-dark-6)",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "all 120ms",
                  }}
                >
                  <Box style={{ color: "var(--mantine-color-gray-5)", display: "flex", alignItems: "center" }}>
                    {cat.icon}
                  </Box>
                  {t(cat.name)}
                </UnstyledButton>
              ))}
            </Box>
          </Box>

          {/* ── Desktop: 3-col grid ── */}
          <Box
            visibleFrom="lg"
            style={{ display: "grid", gridTemplateColumns: "220px 1fr 200px", gap: 12 }}
          >
            {/* Left sidebar */}
            <Box
              style={{
                border: "1px solid var(--mantine-color-gray-2)",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {/* sidebar header */}
              <Box
                px="sm"
                py={10}
                style={{
                  borderBottom: "2px solid var(--afmondo-orange)",
                  backgroundColor: "var(--mantine-color-dark-8)",
                }}
              >
                <Text fz="xs" fw={700} tt="uppercase" c="white" style={{ letterSpacing: 1.5 }}>
                  Categories
                </Text>
              </Box>

              {categories.map((cat, idx) => (
                <UnstyledButton
                  key={idx}
                  component={Link}
                  href={cat.href}
                  className="cat-nav-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "9px 12px",
                    borderBottom: "1px solid var(--mantine-color-gray-1)",
                    backgroundColor: "white",
                    color: "var(--mantine-color-dark-7)",
                    textDecoration: "none",
                  }}
                >
                  <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Box className="cat-nav-icon" style={{ color: "var(--mantine-color-gray-5)", display: "flex", alignItems: "center" }}>
                      {cat.icon}
                    </Box>
                    <Text fz="sm" fw={500} style={{ lineHeight: 1 }}>{t(cat.name)}</Text>
                  </Box>
                  {cat.hasSubmenu && (
                    <IconChevronRight size={13} style={{ color: "var(--mantine-color-gray-4)", flexShrink: 0 }} />
                  )}
                </UnstyledButton>
              ))}
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
                  indicator: {
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.4)",
                  },
                  indicators: { bottom: 14 },
                }}
              >
                {heroSlides.map((slide, idx) => (
                  <Carousel.Slide key={slide.key}>
                    <Box pos="relative" style={{ height: 400, width: "100%" }}>
                      <Image
                        src={slide.image}
                        alt={`Slide ${idx + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                        priority={idx === 0}
                      />
                      <Box
                        pos="absolute"
                        style={{
                          inset: 0,
                          background: "linear-gradient(to top, rgba(0,0,0,0.52) 0%, transparent 55%)",
                        }}
                      />
                      <Box pos="absolute" style={{ bottom: 36, left: 28, right: 28 }}>
                        <Text fz="xl" fw={800} c="white" lh={1.2} style={{ letterSpacing: -0.3 }}>
                          {t(`hero.slide${idx + 1}Title`)}
                        </Text>
                        <Text fz="sm" c="rgba(255,255,255,0.8)" mt={6}>
                          {t(`hero.slide${idx + 1}Description`)}
                        </Text>
                      </Box>
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
                style={{
                  flex: 1,
                  display: "block",
                  borderRadius: 8,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                >
                  <source src="/big_sale.mp4" type="video/mp4" />
                </video>
              </Box>

              <Box
                component={Link}
                href="/electronics/printing-machines"
                style={{
                  flex: 1,
                  display: "block",
                  borderRadius: 8,
                  overflow: "hidden",
                  backgroundColor: "var(--mantine-color-gray-1)",
                  position: "relative",
                  border: "1px solid var(--mantine-color-gray-2)",
                }}
              >
                <Image
                  src="/products/Epson_L3250.jpg"
                  alt="Epson Printer"
                  fill
                  style={{ objectFit: "contain", padding: 12 }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
