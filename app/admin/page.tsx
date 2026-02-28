"use client";

import { useEffect, useState } from "react";
import { Box, SimpleGrid, Text, Title, Group, Skeleton, Stack, Anchor } from "@mantine/core";
import { IconPackage, IconShoppingBag, IconCurrencyDollar, IconAlertTriangle } from "@tabler/icons-react";
import { getDashboardStats } from "@/lib/supabase/queries";
import Link from "next/link";

interface Stat {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconColor: string;
  href: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof getDashboardStats>> | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  const statCards: Stat[] = stats ? [
    {
      label: "Active Products",
      value: stats.totalProducts.toLocaleString(),
      icon: <IconPackage size={22} />,
      iconColor: "var(--afmondo-orange)",
      href: "/admin/products",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: <IconShoppingBag size={22} />,
      iconColor: "var(--afmondo-green)",
      href: "/admin/orders",
    },
    {
      label: "Revenue (CFA)",
      value: stats.totalRevenue.toLocaleString("fr-SN"),
      icon: <IconCurrencyDollar size={22} />,
      iconColor: "var(--afmondo-orange)",
      href: "/admin/orders",
    },
    {
      label: "Low Stock Items",
      value: stats.lowStock.toLocaleString(),
      icon: <IconAlertTriangle size={22} />,
      iconColor: stats.lowStock > 0 ? "#e74c3c" : "var(--afmondo-green)",
      href: "/admin/inventory",
    },
  ] : [];

  return (
    <Box p={{ base: "md", md: "xl" }}>
      {/* Header */}
      <Box mb="xl" pb="md" style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}>
        <Text fz="xs" tt="uppercase" c="dimmed" style={{ letterSpacing: 1.5 }}>Admin Panel</Text>
        <Title order={2} fw={800} fz="xl" mt={4}>Dashboard</Title>
      </Box>

      {/* Stat cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="xl">
        {stats === null
          ? Array(4).fill(0).map((_, i) => <Skeleton key={i} height={110} radius="md" />)
          : statCards.map((s) => (
            <Anchor key={s.label} component={Link} href={s.href} style={{ textDecoration: "none" }}>
              <Box
                style={{
                  border: "1px solid var(--mantine-color-gray-2)",
                  borderRadius: 8,
                  padding: "20px 24px",
                  backgroundColor: "white",
                  transition: "box-shadow 150ms",
                  cursor: "pointer",
                }}
              >
                <Group justify="space-between" align="flex-start">
                  <Box>
                    <Text fz="xs" c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }} mb={6}>{s.label}</Text>
                    <Text fz="2xl" fw={800} c="dark" lh={1}>{s.value}</Text>
                  </Box>
                  <Box style={{ color: s.iconColor }}>{s.icon}</Box>
                </Group>
              </Box>
            </Anchor>
          ))
        }
      </SimpleGrid>

      {/* Quick links */}
      <Box style={{ border: "1px solid var(--mantine-color-gray-2)", borderRadius: 8, backgroundColor: "white" }} p="lg">
        <Text fw={700} fz="sm" mb="md">Quick Actions</Text>
        <Stack gap="sm">
          {[
            { label: "Add a new product", href: "/admin/products/new" },
            { label: "View all orders", href: "/admin/orders" },
            { label: "Check inventory levels", href: "/admin/inventory" },
            { label: "View storefront", href: "/" },
          ].map((link) => (
            <Anchor key={link.href} component={Link} href={link.href} fz="sm" c="orange.6">
              → {link.label}
            </Anchor>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
