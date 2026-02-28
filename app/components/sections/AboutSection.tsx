"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "../../contexts/TranslationContext";
import {
  Box,
  Container,
  Title,
  Text,
  Stack,
  Button,
  Divider,
  Group,
} from "@mantine/core";

export default function AboutSection() {
  const { t } = useTranslation();

  return (
    <Box
      component="section"
      py={{ base: "xl", lg: "2xl" }}
      bg="white"
      style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}
    >
      <Container size="lg">
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="xl">
          {/* Left col — headline */}
          <Box style={{ flex: "1 1 280px" }}>
            <Text
              fz="xs"
              fw={600}
              tt="uppercase"
              c="orange.6"
              style={{ letterSpacing: 2 }}
              mb={6}
            >
              About Us
            </Text>
            <Title order={2} fz={{ base: "2xl", md: "3xl" }} fw={800} c="dark" lh={1.15}>
              Afmondo
            </Title>
            <Divider mt="md" mb="lg" w={40} size={3} color="orange.5" />
            <Button
              component={Link}
              href="/contact"
              color="dark"
              variant="filled"
              size="md"
              radius={0}
              style={{ letterSpacing: 1 }}
            >
              {t("about.contactUs")}
            </Button>
          </Box>

          {/* Right col — copy */}
          <Box style={{ flex: "2 1 400px" }}>
            <Stack gap="md">
              <Box>
                <Text fw={600} fz="sm" c="dark" mb={4}>{t("about.title")}</Text>
                <Text c="dimmed" lh={1.8} fz="sm">
                  {t("about.description")}
                </Text>
              </Box>

              <Box>
                <Text fw={600} fz="sm" c="dark" mb={4}>{t("about.whyTradeTitle")}</Text>
                <Text c="dimmed" lh={1.8} fz="sm">
                  Quality products at competitive prices. Doorstep delivery within major
                  cities in Senegal. 7-day return policy. Manufacturer warranty on every product.{" "}
                  <Text component="span" fw={600} c="dark">{t("about.tagline")}</Text>
                </Text>
              </Box>
            </Stack>
          </Box>
        </Group>
      </Container>
    </Box>
  );
}
