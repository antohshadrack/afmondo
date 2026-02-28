"use client";

import Header from "../components/shared/header";
import Footer from "../components/sections/Footer";
import {
  Box, Container, Title, Text, Stack, SimpleGrid,
  ThemeIcon, Divider, Table, Badge,
} from "@mantine/core";
import { IconTruck, IconClock, IconMapPin, IconPackage, IconAlertCircle } from "@tabler/icons-react";

const zones = [
  { region: "Dakar (commune)", time: "1–2 business days", fee: "Free over 50,000 CFA / 2,500 CFA" },
  { region: "Grand Dakar & banlieue", time: "1–2 business days", fee: "Free over 75,000 CFA / 3,500 CFA" },
  { region: "Thiès", time: "2–3 business days", fee: "5,000 CFA" },
  { region: "Saint-Louis", time: "3–4 business days", fee: "6,500 CFA" },
  { region: "Ziguinchor", time: "4–5 business days", fee: "7,500 CFA" },
  { region: "Kaolack", time: "3–4 business days", fee: "6,000 CFA" },
  { region: "Tambacounda", time: "4–5 business days", fee: "7,000 CFA" },
  { region: "Other regions", time: "5–7 business days", fee: "Contact us for a quote" },
];

const steps = [
  { icon: <IconPackage size={20} />, title: "Order confirmed", desc: "You receive an SMS confirmation with your order number immediately after purchase." },
  { icon: <IconClock size={20} />, title: "Processing", desc: "Our team verifies and prepares your order within 12–24 hours of payment confirmation." },
  { icon: <IconTruck size={20} />, title: "Dispatched", desc: "You receive an SMS with your tracking number once the delivery partner picks up your order." },
  { icon: <IconMapPin size={20} />, title: "Delivered", desc: "Your item arrives at your door. For large items (vehicles, furniture), our team arranges a delivery slot with you in advance." },
];

export default function ShippingPage() {
  return (
    <Box>
      <Header />

      {/* Hero */}
      <Box bg="dark.8" py={{ base: 60, md: 80 }} style={{ borderBottom: "3px solid var(--afmondo-orange)" }}>
        <Container size="md">
          <Text fz="xs" fw={600} tt="uppercase" c="orange.4" style={{ letterSpacing: 2 }} mb={10}>
            Delivery
          </Text>
          <Title order={1} c="white" fw={800} fz={{ base: "2xl", md: "4xl" }} lh={1.15} maw={560}>
            Shipping & Delivery Information
          </Title>
          <Text c="rgba(255,255,255,0.6)" mt="lg" fz="md" lh={1.8} maw={500}>
            We deliver to all major regions of Senegal. Here's everything you need to know
            about our delivery process, timelines, and fees.
          </Text>
        </Container>
      </Box>

      {/* Process */}
      <Box py={{ base: "xl", md: 80 }} bg="white">
        <Container size="lg">
          <Text fz="xs" fw={700} tt="uppercase" c="orange.6" style={{ letterSpacing: 2 }} mb={6}>
            How it works
          </Text>
          <Title order={2} fw={800} fz={{ base: "xl", md: "2xl" }} mb={40}>
            Your order, step by step
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
            {steps.map((step, i) => (
              <Box key={i} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Box style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Box
                    style={{
                      width: 36, height: 36, borderRadius: "50%",
                      backgroundColor: "var(--mantine-color-orange-1)",
                      color: "var(--afmondo-orange)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Text fw={700} fz="xs" tt="uppercase" c="dimmed" style={{ letterSpacing: 0.8 }}>Step {i + 1}</Text>
                </Box>
                <Text fw={700} fz="sm">{step.title}</Text>
                <Text fz="sm" c="dimmed" lh={1.7}>{step.desc}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Delivery zones */}
      <Box py={{ base: "xl", md: 80 }} bg="gray.0" style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}>
        <Container size="lg">
          <Text fz="xs" fw={700} tt="uppercase" c="orange.6" style={{ letterSpacing: 2 }} mb={6}>
            Delivery zones
          </Text>
          <Title order={2} fw={800} fz={{ base: "xl", md: "2xl" }} mb={30}>
            Fees & timelines by region
          </Title>
          <Box style={{ overflowX: "auto" }}>
            <Table striped withTableBorder withColumnBorders highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th><Text fw={700} fz="xs" tt="uppercase">Region</Text></Table.Th>
                  <Table.Th><Text fw={700} fz="xs" tt="uppercase">Estimated Time</Text></Table.Th>
                  <Table.Th><Text fw={700} fz="xs" tt="uppercase">Delivery Fee</Text></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {zones.map((z) => (
                  <Table.Tr key={z.region}>
                    <Table.Td><Text fz="sm" fw={500}>{z.region}</Text></Table.Td>
                    <Table.Td><Text fz="sm" c="dimmed">{z.time}</Text></Table.Td>
                    <Table.Td><Text fz="sm">{z.fee}</Text></Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>

          <Box mt="lg" style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <IconAlertCircle size={16} style={{ color: "var(--mantine-color-orange-5)", flexShrink: 0, marginTop: 2 }} />
            <Text fz="xs" c="dimmed" lh={1.7}>
              Delivery times are estimates and may vary due to public holidays, extreme weather, or high demand periods.
              Large items (vehicles, heavy machinery) are delivered by appointment — our team will contact you to arrange a suitable time.
            </Text>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
