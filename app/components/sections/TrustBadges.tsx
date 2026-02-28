"use client";

import React from "react";
import { IconTruck, IconRefresh, IconShieldCheck, IconClock } from "@tabler/icons-react";
import { useTranslation } from "../../contexts/TranslationContext";
import { Box, SimpleGrid, Text, Group } from "@mantine/core";

const badges = [
  { icon: <IconTruck size={20} />, title: "trustBadges.freeShipping" },
  { icon: <IconRefresh size={20} />, title: "trustBadges.moneyBack" },
  { icon: <IconShieldCheck size={20} />, title: "trustBadges.securePayment" },
  { icon: <IconClock size={20} />, title: "trustBadges.onlinePurchases" },
];

export default function TrustBadges() {
  const { t } = useTranslation();

  return (
    <Box
      component="section"
      py={{ base: "md", md: "lg" }}
      bg="dark.8"
    >
      <Box px={{ base: "md", lg: "xl" }} maw={1400} mx="auto">
        <SimpleGrid cols={{ base: 2, sm: 4 }} spacing={0}>
          {badges.map((badge, i) => (
            <Group
              key={i}
              gap="sm"
              align="center"
              justify="center"
              py="md"
              px="lg"
              wrap="nowrap"
              style={{
                borderRight: i < badges.length - 1 ? "1px solid rgba(255,255,255,0.08)" : undefined,
              }}
            >
              <Box style={{ color: "var(--afmondo-orange)", flexShrink: 0 }}>
                {badge.icon}
              </Box>
              <Text fw={500} fz="sm" c="white" lh={1.3}>
                {t(badge.title)}
              </Text>
            </Group>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
