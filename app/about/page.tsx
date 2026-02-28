"use client";

import Header from "../components/shared/header";
import Footer from "../components/sections/Footer";
import {
  Box, Container, Title, Text, Stack, SimpleGrid,
  ThemeIcon, Group, Divider, Button,
} from "@mantine/core";
import {
  IconTruck, IconShieldCheck, IconHeadset,
  IconRefresh, IconStar, IconMapPin,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";

const values = [
  { icon: <IconShieldCheck size={22} />, title: "Quality Guaranteed", desc: "Every product is verified for authenticity and quality before listing." },
  { icon: <IconTruck size={22} />, title: "Doorstep Delivery", desc: "We deliver to major cities across Senegal, right to your door." },
  { icon: <IconRefresh size={22} />, title: "7-Day Returns", desc: "Not satisfied? Return any product within 7 days, no questions asked." },
  { icon: <IconHeadset size={22} />, title: "Dedicated Support", desc: "Our team is available to assist you before, during, and after your purchase." },
  { icon: <IconStar size={22} />, title: "Competitive Prices", desc: "We negotiate directly with suppliers to bring you the best prices in the market." },
  { icon: <IconMapPin size={22} />, title: "Based in Dakar", desc: "A proudly Senegalese company serving customers across West Africa." },
];

export default function AboutPage() {
  return (
    <Box>
      <Header />

      {/* Hero */}
      <Box bg="dark.8" py={{ base: 60, md: 80 }} style={{ borderBottom: "3px solid var(--afmondo-orange)" }}>
        <Container size="lg">
          <Text fz="xs" fw={600} tt="uppercase" c="orange.4" style={{ letterSpacing: 2 }} mb={10}>
            About Afmondo
          </Text>
          <Title order={1} c="white" fw={800} fz={{ base: "2xl", md: "4xl" }} lh={1.1} maw={620}>
            Quality products. Honest prices. Trusted service.
          </Title>
          <Text c="rgba(255,255,255,0.65)" mt="lg" fz="md" maw={520} lh={1.8}>
            Afmondo is Senegal's leading marketplace for vehicles, electronics, furniture,
            and home appliances — built on a simple promise: give every customer real value.
          </Text>
        </Container>
      </Box>

      {/* Mission */}
      <Box py={{ base: "xl", md: 80 }} bg="white">
        <Container size="lg">
          <Group justify="space-between" align="flex-start" wrap="wrap" gap={40}>
            <Box style={{ flex: "1 1 340px" }}>
              <Text fz="xs" fw={700} tt="uppercase" c="orange.6" style={{ letterSpacing: 2 }} mb={8}>
                Our Mission
              </Text>
              <Title order={2} fw={800} fz={{ base: "xl", md: "2xl" }} lh={1.2} mb="md">
                Making quality accessible to every Senegalese household
              </Title>
              <Text c="dimmed" lh={1.9} fz="sm">
                We started Afmondo because we believed that buying a car, a fridge, or a sofa
                shouldn't require navigating counterfeit markets or haggling with resellers.
                We partner directly with manufacturers and authorised distributors so that
                every product on our platform comes with full traceability and warranty.
              </Text>
              <Text c="dimmed" lh={1.9} fz="sm" mt="md">
                Today we serve thousands of customers across Dakar, Thiès, Saint-Louis,
                and beyond — and we're just getting started.
              </Text>
            </Box>
            <Box
              style={{
                flex: "1 1 300px",
                borderRadius: 8,
                overflow: "hidden",
                aspectRatio: "4/3",
                position: "relative",
                backgroundColor: "var(--mantine-color-gray-1)",
                minHeight: 240,
              }}
            >
              <Image src="/images/hero/slide-1.jpg" alt="Afmondo team" fill style={{ objectFit: "cover" }} />
            </Box>
          </Group>
        </Container>
      </Box>

      {/* Values */}
      <Box py={{ base: "xl", md: 80 }} bg="gray.0" style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}>
        <Container size="lg">
          <Text fz="xs" fw={700} tt="uppercase" c="orange.6" style={{ letterSpacing: 2 }} ta="center" mb={6}>
            What we stand for
          </Text>
          <Title order={2} fw={800} fz={{ base: "xl", md: "2xl" }} ta="center" mb={40}>
            Our Values
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            {values.map((v) => (
              <Box key={v.title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <Box style={{ color: "var(--afmondo-orange)", flexShrink: 0, marginTop: 2 }}>{v.icon}</Box>
                <Box>
                  <Text fw={700} fz="sm" mb={4}>{v.title}</Text>
                  <Text fz="sm" c="dimmed" lh={1.7}>{v.desc}</Text>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* CTA */}
      <Box py={{ base: "xl", md: 60 }} bg="white">
        <Container size="sm">
          <Stack align="center" ta="center" gap="md">
            <Title order={3} fw={800}>Ready to shop?</Title>
            <Text c="dimmed" fz="sm">Browse thousands of verified products across all categories.</Text>
            <Group>
              <Button component={Link} href="/" color="orange" size="md" radius="sm">Shop Now</Button>
              <Button component={Link} href="/contact" variant="default" size="md" radius="sm">Contact Us</Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
