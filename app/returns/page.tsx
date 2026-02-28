"use client";

import Header from "../components/shared/header";
import Footer from "../components/sections/Footer";
import {
  Box, Container, Title, Text, Stack, SimpleGrid,
  ThemeIcon, Stepper, Badge, Divider, Anchor, Group,
} from "@mantine/core";
import {
  IconPackage, IconPhone, IconTruck, IconRefresh,
  IconCircleCheck, IconAlertCircle,
} from "@tabler/icons-react";

const eligibleItems = [
  "Electronics (TVs, printers, refrigerators) — original packaging required",
  "Furniture — unused, unassembled condition",
  "Vehicles — within 7 days, no modifications or registrations made",
  "Kitchen appliances — original sealed packaging",
];

const ineligibleItems = [
  "Items damaged by misuse or accidents",
  "Products with removed or tampered serial numbers",
  "Personalised or custom-ordered products",
  "Perishable or hygiene products",
];

export default function ReturnsPage() {
  return (
    <Box>
      <Header />

      {/* Hero */}
      <Box bg="dark.8" py={{ base: 60, md: 80 }} style={{ borderBottom: "3px solid var(--afmondo-orange)" }}>
        <Container size="md">
          <Text fz="xs" fw={600} tt="uppercase" c="orange.4" style={{ letterSpacing: 2 }} mb={10}>
            Returns & Refunds
          </Text>
          <Title order={1} c="white" fw={800} fz={{ base: "2xl", md: "4xl" }} lh={1.15} maw={560}>
            7-Day hassle-free returns
          </Title>
          <Text c="rgba(255,255,255,0.6)" mt="lg" fz="md" lh={1.8} maw={500}>
            Changed your mind? Something doesn't look right? We've made returning a product as simple as possible.
          </Text>
        </Container>
      </Box>

      {/* How to return */}
      <Box py={{ base: "xl", md: 80 }} bg="white">
        <Container size="md">
          <Text fz="xs" fw={700} tt="uppercase" c="orange.6" style={{ letterSpacing: 2 }} mb={6}>
            How it works
          </Text>
          <Title order={2} fw={800} fz={{ base: "xl", md: "2xl" }} mb={40}>Return process</Title>

          <Stepper active={-1} orientation="vertical" color="orange">
            <Stepper.Step
              icon={<IconPhone size={18} />}
              label="Contact us within 7 days"
              description={
                <Text fz="sm" c="dimmed" lh={1.7} mb="md">
                  Reach out via WhatsApp (+221 77 000 0000) or email (support@afmondo.com) within 7 days of receiving your order.
                  Have your order number ready.
                </Text>
              }
            />
            <Stepper.Step
              icon={<IconPackage size={18} />}
              label="Package the item"
              description={
                <Text fz="sm" c="dimmed" lh={1.7} mb="md">
                  Repack the item in its original packaging with all accessories, manuals, and tags. Take photos of the item before sealing.
                </Text>
              }
            />
            <Stepper.Step
              icon={<IconTruck size={18} />}
              label="We collect"
              description={
                <Text fz="sm" c="dimmed" lh={1.7} mb="md">
                  Our delivery team will schedule a free pickup from your address within 1–2 business days.
                </Text>
              }
            />
            <Stepper.Step
              icon={<IconRefresh size={18} />}
              label="Refund processed"
              description={
                <Text fz="sm" c="dimmed" lh={1.7} mb="md">
                  Once we inspect the item and confirm it meets our return conditions, your refund is processed within 3–5 business days.
                </Text>
              }
            />
          </Stepper>
        </Container>
      </Box>

      {/* Eligible / not eligible */}
      <Box py={{ base: "xl", md: 60 }} bg="gray.0" style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}>
        <Container size="lg">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
            <Box>
              <Group gap="sm" mb="md">
                <IconCircleCheck size={20} style={{ color: "var(--afmondo-green)" }} />
                <Text fw={700} fz="md">Eligible for return</Text>
              </Group>
              <Stack gap="sm">
                {eligibleItems.map((item) => (
                  <Box key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <Box style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--afmondo-green)", flexShrink: 0, marginTop: 7 }} />
                    <Text fz="sm" c="dimmed" lh={1.7}>{item}</Text>
                  </Box>
                ))}
              </Stack>
            </Box>
            <Box>
              <Group gap="sm" mb="md">
                <IconAlertCircle size={20} style={{ color: "var(--mantine-color-red-5)" }} />
                <Text fw={700} fz="md">Not eligible</Text>
              </Group>
              <Stack gap="sm">
                {ineligibleItems.map((item) => (
                  <Box key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <Box style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "var(--mantine-color-red-4)", flexShrink: 0, marginTop: 7 }} />
                    <Text fz="sm" c="dimmed" lh={1.7}>{item}</Text>
                  </Box>
                ))}
              </Stack>
            </Box>
          </SimpleGrid>

          <Divider my="xl" />
          <Text fz="xs" c="dimmed" lh={1.8}>
            <Text span fw={600} c="dark">Note:</Text> Refunds are issued to the original payment method. Processing times may vary depending on your bank or mobile money provider.
            For any questions, contact <Anchor href="mailto:support@afmondo.com" c="orange.6">support@afmondo.com</Anchor>.
          </Text>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
