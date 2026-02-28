"use client";

import { useState } from "react";
import Header from "../components/shared/header";
import Footer from "../components/sections/Footer";
import {
  Box, Container, Title, Text, Stack, TextInput,
  Button, Paper, Group, ThemeIcon, Badge, Divider,
} from "@mantine/core";
import {
  IconSearch, IconPackage, IconTruck, IconCircleCheck,
  IconClock, IconMapPin, IconAlertCircle,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

// Mock order statuses
const mockOrders: Record<string, { status: string; steps: { label: string; time: string; done: boolean; icon: React.ReactNode }[]; product: string }> = {
  "AFM-001": {
    product: "Samsung 55\" Smart TV",
    status: "delivered",
    steps: [
      { label: "Order confirmed", time: "Feb 20, 2025 – 10:24 AM", done: true, icon: <IconPackage size={16} /> },
      { label: "Preparing your order", time: "Feb 20, 2025 – 2:00 PM", done: true, icon: <IconClock size={16} /> },
      { label: "Dispatched", time: "Feb 21, 2025 – 9:00 AM", done: true, icon: <IconTruck size={16} /> },
      { label: "Delivered", time: "Feb 22, 2025 – 11:45 AM", done: true, icon: <IconCircleCheck size={16} /> },
    ],
  },
  "AFM-002": {
    product: "Toyota Hilux 2022",
    status: "in_transit",
    steps: [
      { label: "Order confirmed", time: "Feb 26, 2025 – 3:12 PM", done: true, icon: <IconPackage size={16} /> },
      { label: "Preparing your order", time: "Feb 27, 2025 – 9:00 AM", done: true, icon: <IconClock size={16} /> },
      { label: "Dispatched", time: "Feb 28, 2025 – 8:30 AM", done: true, icon: <IconTruck size={16} /> },
      { label: "Delivered", time: "Expected: Mar 1, 2025", done: false, icon: <IconCircleCheck size={16} /> },
    ],
  },
};

const statusColors: Record<string, string> = {
  delivered: "green",
  in_transit: "orange",
  processing: "blue",
};

const statusLabels: Record<string, string> = {
  delivered: "Delivered",
  in_transit: "In Transit",
  processing: "Processing",
};

export default function TrackPage() {
  const [orderNum, setOrderNum] = useState("");
  const [result, setResult] = useState<typeof mockOrders[string] | null | "notfound">(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const key = orderNum.trim().toUpperCase();
    if (mockOrders[key]) {
      setResult(mockOrders[key]);
    } else {
      setResult("notfound");
      notifications.show({ title: "Order not found", message: "Check your order number and try again.", color: "red" });
    }
  };

  return (
    <Box>
      <Header />

      {/* Hero with search */}
      <Box bg="dark.8" py={{ base: 60, md: 80 }} style={{ borderBottom: "3px solid var(--afmondo-orange)" }}>
        <Container size="md" ta="center">
          <Text fz="xs" fw={600} tt="uppercase" c="orange.4" style={{ letterSpacing: 2 }} mb={10}>
            Order Tracking
          </Text>
          <Title order={1} c="white" fw={800} fz={{ base: "2xl", md: "4xl" }} lh={1.15} mb="lg">
            Track your order
          </Title>
          <Text c="rgba(255,255,255,0.6)" fz="sm" mb="xl">
            Enter your order number (e.g. AFM-001) from your confirmation SMS.
          </Text>
          <form onSubmit={handleSearch}>
            <Group gap="sm" justify="center" wrap="nowrap" maw={480} mx="auto">
              <TextInput
                size="md"
                radius="sm"
                placeholder="AFM-XXXXXX"
                value={orderNum}
                onChange={(e) => setOrderNum(e.currentTarget.value)}
                leftSection={<IconSearch size={16} />}
                style={{ flex: 1 }}
                styles={{ input: { textTransform: "uppercase" } }}
              />
              <Button type="submit" color="orange" size="md" radius="sm" style={{ flexShrink: 0 }}>
                Track
              </Button>
            </Group>
          </form>
        </Container>
      </Box>

      {/* Result */}
      <Box py={{ base: "xl", md: 80 }} bg="white" style={{ minHeight: 300 }}>
        <Container size="sm">
          {result === null && (
            <Stack align="center" gap="sm" py={40} ta="center">
              <ThemeIcon size={60} radius="xl" color="gray" variant="light">
                <IconPackage size={28} />
              </ThemeIcon>
              <Text c="dimmed" fz="sm">Enter your order number above to see its status.</Text>
            </Stack>
          )}

          {result === "notfound" && (
            <Stack align="center" gap="sm" py={40} ta="center">
              <ThemeIcon size={60} radius="xl" color="red" variant="light">
                <IconAlertCircle size={28} />
              </ThemeIcon>
              <Title order={4} fw={700}>Order not found</Title>
              <Text c="dimmed" fz="sm">
                We couldn't find an order with that number. Double-check your confirmation SMS
                or contact <Text span c="orange.6" fw={600}>support@afmondo.com</Text>.
              </Text>
            </Stack>
          )}

          {result && result !== "notfound" && (
            <Paper radius="lg" p="xl" shadow="xs" style={{ border: "1px solid var(--mantine-color-gray-2)" }}>
              <Group justify="space-between" mb="xs" wrap="wrap">
                <Text fw={700} fz="lg">{result.product}</Text>
                <Badge color={statusColors[result.status]} radius="sm" size="lg">
                  {statusLabels[result.status]}
                </Badge>
              </Group>
              <Text fz="xs" c="dimmed" mb="xl">Order #{orderNum.toUpperCase()}</Text>

              <Stack gap={0}>
                {result.steps.map((step, i) => (
                  <Box key={i} style={{ display: "flex", gap: 14, paddingBottom: i < result.steps.length - 1 ? 20 : 0 }}>
                    {/* Timeline dot + line */}
                    <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <Box
                        style={{
                          width: 32, height: 32, borderRadius: "50%",
                          backgroundColor: step.done ? "var(--afmondo-orange)" : "var(--mantine-color-gray-2)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: step.done ? "white" : "var(--mantine-color-gray-5)",
                          flexShrink: 0,
                        }}
                      >
                        {step.icon}
                      </Box>
                      {i < result.steps.length - 1 && (
                        <Box style={{ width: 2, flex: 1, minHeight: 20, backgroundColor: step.done ? "var(--afmondo-orange)" : "var(--mantine-color-gray-2)", marginTop: 4 }} />
                      )}
                    </Box>
                    {/* Content */}
                    <Box pb={i < result.steps.length - 1 ? 4 : 0}>
                      <Text fw={600} fz="sm" c={step.done ? "dark" : "dimmed"}>{step.label}</Text>
                      <Text fz="xs" c="dimmed" mt={2}>{step.time}</Text>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
