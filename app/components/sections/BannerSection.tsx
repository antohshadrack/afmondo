"use client";

import Link from "next/link";
import Image from "next/image";
import { banners } from "@/lib/data/banners";
import {
  Box,
  Container,
  SimpleGrid,
  Text,
  Stack,
  Divider,
} from "@mantine/core";

export default function BannerSection() {
  return (
    <Box component="section" mt={{ base: "xl", md: "2xl" }}>
      <Container size="xl">
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
          {banners.map((item) => (
            <Box
              key={item.id}
              component={Link}
              href={item.link}
              pos="relative"
              style={{
                height: 184,
                overflow: "hidden",
                borderRadius: "var(--mantine-radius-md)",
                display: "block",
                cursor: "pointer",
                textDecoration: "none",
                backgroundColor: item.bgcolor ?? "var(--mantine-color-gray-2)",
              }}
              className="banner-item"
            >
              {/* Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                style={{ objectFit: "cover", transition: "transform 300ms ease" }}
                className="banner-img"
              />

              {/* Content overlay */}
              <Box
                pos="absolute"
                style={{ inset: 0, zIndex: 10, padding: 24, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}
              >
                <Box
                  style={{
                    backdropFilter: "blur(4px)",
                    backgroundColor: "rgba(0,0,0,0.25)",
                    borderRadius: "var(--mantine-radius-sm)",
                    padding: "12px 16px",
                    width: "fit-content",
                  }}
                >
                  <Text
                    fz="xs"
                    fw={600}
                    tt="uppercase"
                    c="white"
                    mb={4}
                    style={{ letterSpacing: 3, opacity: 0.9 }}
                  >
                    {item.subtitle}
                  </Text>
                  <Divider color="rgba(255,255,255,0.5)" mb={6} w={32} />
                  <Text fz={{ base: "md", md: "xl" }} fw={300} c="white" lh={1.2}>
                    {item.title}
                  </Text>
                </Box>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
