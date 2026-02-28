"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button, Box, Text, Stack } from "@mantine/core";
import { slides, type Slide } from "@/lib/data/slides";
import { useTranslation } from "../../contexts/TranslationContext";

export default function Slideshow() {
  const { t } = useTranslation();
  const [shuffledSlides, setShuffledSlides] = useState<Slide[]>(slides);
  const autoplay = useRef(Autoplay({ delay: 6000 }));

  useEffect(() => {
    const newSlides = [...slides];
    for (let i = newSlides.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newSlides[i], newSlides[j]] = [newSlides[j], newSlides[i]];
    }
    setShuffledSlides(newSlides);
  }, []);

  return (
    <section>
      <Carousel
        withIndicators
        withControls
        emblaOptions={{ loop: true }}
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
        styles={{
          root: { width: "100%" },
          indicator: {
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.5)",
            "&[dataActive]": {
              backgroundColor: "white",
            },
          },
          controls: {
            padding: "0 16px",
          },
          control: {
            backgroundColor: "rgba(255,255,255,0.2)",
            border: "none",
            color: "white",
            backdropFilter: "blur(4px)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.4)",
            },
          },
        }}
      >
        {shuffledSlides.map((slide, index) => (
          <Carousel.Slide key={slide.id}>
            <Box
              pos="relative"
              style={{
                width: "100%",
                height: "min(100vh, 640px)",
                overflow: "hidden",
                backgroundColor: "#1a1a2e",
              }}
            >
              {/* Desktop Image */}
              <Box visibleFrom="md" style={{ position: "absolute", inset: 0 }}>
                <a href={slide.ctaLink} style={{ position: "absolute", inset: 0, display: "block" }}>
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    style={{ objectFit: "cover" }}
                  />
                </a>
              </Box>

              {/* Mobile Image */}
              <Box hiddenFrom="md" style={{ position: "absolute", inset: 0 }}>
                <a href={slide.ctaLink} style={{ position: "absolute", inset: 0, display: "block" }}>
                  <Image
                    src={slide.mobileImage}
                    alt={slide.title}
                    fill
                    priority={index === 0}
                    style={{ objectFit: "cover" }}
                  />
                </a>
              </Box>

              {/* Gradient Overlay */}
              <Box
                pos="absolute"
                style={{
                  inset: 0,
                  background:
                    "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)",
                }}
              />

              {/* Content */}
              <Stack
                pos="absolute"
                style={{ inset: 0, justifyContent: "center", padding: "48px" }}
                gap="md"
                maw={520}
              >
                <Text
                  fz={{ base: "xs", md: "sm" }}
                  fw={400}
                  c="white"
                  tt="uppercase"
                  style={{ letterSpacing: 4, opacity: 0.85 }}
                >
                  {t(`slideshow.slide${slide.id}.subtitle`)}
                </Text>
                <Text fz={{ base: "2xl", md: "4xl" }} fw={300} c="white" lh={1.2}>
                  {t(`slideshow.slide${slide.id}.title`)}
                </Text>
                <Text fz={{ base: "sm", md: "md" }} c="rgba(255,255,255,0.85)" fw={300}>
                  {t(`slideshow.slide${slide.id}.description`)}
                </Text>
                <Box>
                  <Button
                    component={Link}
                    href={slide.ctaLink}
                    variant="outline"
                    color="white"
                    size="md"
                    radius={0}
                    style={{
                      borderColor: "white",
                      color: "white",
                      fontWeight: 600,
                      letterSpacing: 1,
                    }}
                  >
                    {t(`slideshow.slide${slide.id}.ctaText`)}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Carousel.Slide>
        ))}
      </Carousel>
    </section>
  );
}
