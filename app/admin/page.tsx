"use client";
import AnalyticsSection from "./AnalyticsSection";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Box, SimpleGrid, Text, Group, Skeleton, Stack, Paper,
  Button, Badge, Table, Anchor, ThemeIcon, Progress,
  ActionIcon, Tooltip,
} from "@mantine/core";
import {
  IconPackage, IconShoppingBag, IconCurrencyDollar, IconAlertTriangle,
  IconArrowRight, IconPlus, IconBrandWhatsapp, IconTrendingUp,
  IconTrendingDown, IconClock, IconCheck, IconTruck, IconCircleCheck,
  IconX, IconRefresh,
} from "@tabler/icons-react";
import { getDashboardStats, getRecentOrders, getRecentProducts } from "@/lib/supabase/queries";
import type { DbOrder, DbProduct } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";

/* ── Design tokens ───────────────────────────────────────── */
const ORANGE  = "#f5a623";
const CARD_SH = "0 1px 4px rgba(0,0,0,0.06)";

const STATUS_META: Record<string, { color: string; mantine: string; icon: React.ReactNode }> = {
  pending:    { color: "#f59e0b", mantine: "yellow",  icon: <IconClock size={12} /> },
  confirmed:  { color: "#3b82f6", mantine: "blue",   icon: <IconCheck size={12} /> },
  processing: { color: "#06b6d4", mantine: "cyan",   icon: <IconRefresh size={12} /> },
  dispatched: { color: "#f97316", mantine: "orange",  icon: <IconTruck size={12} /> },
  delivered:  { color: "#10b981", mantine: "green",  icon: <IconCircleCheck size={12} /> },
  cancelled:  { color: "#ef4444", mantine: "red",    icon: <IconX size={12} /> },
};

/* ── Stat card ───────────────────────────────────────────── */
function StatCard({ label, value, sub, icon, iconBg, href }: {
  label: string; value: string; sub?: string;
  icon: React.ReactNode; iconBg: string; href: string;
}) {
  return (
    <Anchor component={Link} href={href} style={{ textDecoration: "none" }}>
      <Paper radius="md" p="lg" shadow="xs" style={{ background: "#fff", border: "1px solid #f1f3f5", boxShadow: CARD_SH }}>
        <Group justify="space-between" align="flex-start">
          <Box>
            <Text fz={12} fw={600} style={{ color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }} mb={6}>
              {label}
            </Text>
            <Text fz={24} fw={800} lh={1} c="#111">{value}</Text>
            {sub && <Text fz={11} mt={6} c="#9ca3af">{sub}</Text>}
          </Box>
          <Box style={{
            width: 48, height: 48, borderRadius: 10,
            background: iconBg,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {icon}
          </Box>
        </Group>
      </Paper>
    </Anchor>
  );
}

/* ── Main page ───────────────────────────────────────────── */
export default function AdminDashboard() {
  const [stats, setStats] = useState<{ totalProducts: number; totalOrders: number; totalRevenue: number; lowStock: number } | null>(null);
  const [recentOrders, setRecentOrders] = useState<DbOrder[]>([]);
  const [recentProducts, setRecentProducts] = useState<DbProduct[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<Record<string, number>>({});
  const sb = createClient();

  useEffect(() => {
    Promise.all([
      getDashboardStats(), getRecentOrders(8), getRecentProducts(5),
      sb.from("orders").select("status"),
    ]).then(([s, orders, products, { data: all }]) => {
      setStats(s); setRecentOrders(orders); setRecentProducts(products);
      const bd: Record<string, number> = {};
      (all ?? []).forEach((o: { status: string }) => { bd[o.status] = (bd[o.status] ?? 0) + 1; });
      setStatusBreakdown(bd);
    });
  }, []);

  const totalOrders = Object.values(statusBreakdown).reduce((a, b) => a + b, 0);

  return (
    <Box p="xl">
      {/* ── Stat cards ─────────────────────────────── */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="xl">
        {!stats ? Array(4).fill(0).map((_, i) => <Skeleton key={i} h={110} radius="md" />) : [
          { label: "Total Orders",    value: stats.totalOrders.toLocaleString(),                    icon: <IconShoppingBag size={22} color="#f5a623" />, iconBg: "#fff3e0", href: "/admin/orders",    sub: "all time" },
          { label: "Active Products", value: stats.totalProducts.toLocaleString(),                  icon: <IconPackage size={22} color="#3b82f6" />,     iconBg: "#eff6ff", href: "/admin/products",  sub: "published" },
          { label: "Revenue (CFA)",   value: stats.totalRevenue.toLocaleString("fr-SN"),             icon: <IconCurrencyDollar size={22} color="#10b981" />, iconBg: "#ecfdf5", href: "/admin/orders", sub: "delivered" },
          { label: "Low Stock",       value: stats.lowStock.toLocaleString(),                        icon: <IconAlertTriangle size={22} color={stats.lowStock > 0 ? "#ef4444" : "#10b981"} />, iconBg: stats.lowStock > 0 ? "#fef2f2" : "#ecfdf5", href: "/admin/inventory", sub: "items" },
        ].map(s => <StatCard key={s.label} {...s} />)}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="lg" mb="lg">

        {/* ── Order status breakdown ──────────────────── */}
        <Paper radius="md" p="lg" shadow="xs" style={{ background: "#fff", border: "1px solid #f1f3f5" }}>
          <Group justify="space-between" mb="md">
            <Text fw={700} fz={14} c="#111">Order Status</Text>
            <Anchor component={Link} href="/admin/orders" fz={12} c={ORANGE} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              View all <IconArrowRight size={12} />
            </Anchor>
          </Group>
          {totalOrders === 0
            ? <Text c="dimmed" fz="sm" ta="center" py="xl">No orders yet</Text>
            : <Stack gap={10}>
                {Object.entries(STATUS_META).map(([status, meta]) => {
                  const count = statusBreakdown[status] ?? 0;
                  if (count === 0) return null;
                  const pct = Math.round((count / totalOrders) * 100);
                  return (
                    <Box key={status}>
                      <Group justify="space-between" mb={4}>
                        <Group gap={6}>
                          <Box style={{ width: 8, height: 8, borderRadius: "50%", background: meta.color }} />
                          <Text fz={12} fw={500} tt="capitalize" c="#444">{status}</Text>
                        </Group>
                        <Text fz={11} c="#9ca3af">{count} ({pct}%)</Text>
                      </Group>
                      <Progress value={pct} color={meta.mantine} size={6} radius="xl" />
                    </Box>
                  );
                })}
              </Stack>
          }
        </Paper>

        {/* ── Recent Products ─────────────────────────── */}
        <Paper radius="md" shadow="xs" style={{ background: "#fff", border: "1px solid #f1f3f5", overflow: "hidden" }}>
          <Group justify="space-between" p="md" style={{ borderBottom: "1px solid #f8f9fa" }}>
            <Text fw={700} fz={14} c="#111">Recent Products</Text>
            <Button component={Link} href="/admin/products/new" size="xs" radius="md"
              leftSection={<IconPlus size={12} />} color="orange">
              Add New
            </Button>
          </Group>
          <Stack gap={0}>
            {recentProducts.map((p, i) => (
              <Group key={p.id} px="md" py="sm" gap="sm"
                style={{ borderBottom: i < recentProducts.length - 1 ? "1px solid #f8f9fa" : undefined }}>
                <Box style={{ width: 38, height: 38, borderRadius: 8, overflow: "hidden", flexShrink: 0, position: "relative", background: "#f8f9fa" }}>
                  {p.images?.[0]
                    ? <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: "cover" }} />
                    : <Box style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}><IconPackage size={16} color="#ccc" /></Box>
                  }
                </Box>
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text fz={13} fw={500} lineClamp={1} c="#222">{p.name}</Text>
                  <Text fz={11} c="#9ca3af">{p.price.toLocaleString("fr-SN")} CFA</Text>
                </Box>
                <Badge size="xs" color={p.is_active ? "green" : "gray"} variant="light" radius="sm">
                  {p.is_active ? "Active" : "Draft"}
                </Badge>
              </Group>
            ))}
            {recentProducts.length === 0 && <Text c="dimmed" fz="sm" ta="center" py="xl">No products yet</Text>}
          </Stack>
        </Paper>

        {/* ── Quick actions ───────────────────────────── */}
        <Paper radius="md" p="lg" shadow="xs" style={{ background: "#fff", border: "1px solid #f1f3f5" }}>
          <Text fw={700} fz={14} c="#111" mb="md">Quick Actions</Text>
          <Stack gap="sm">
            {[
              { label: "Add New Product",  href: "/admin/products/new", color: ORANGE,    bg: "#fff3e0" },
              { label: "Manage Categories",href: "/admin/categories",   color: "#8b5cf6", bg: "#f5f3ff" },
              { label: "View All Orders",  href: "/admin/orders",       color: "#3b82f6", bg: "#eff6ff" },
              { label: "Check Inventory",  href: "/admin/inventory",    color: "#10b981", bg: "#ecfdf5" },
              { label: "View Storefront",  href: "/",                   color: "#6366f1", bg: "#f0f9ff" },
            ].map(({ label, href, color, bg }) => (
              <Anchor key={href} component={Link} href={href} style={{ textDecoration: "none" }}>
                <Group
                  align="center" gap="sm"
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid #f3f4f6",
                    background: "#fafafa",
                    transition: "background 100ms",
                    cursor: "pointer",
                  }}
                >
                  <Box style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <Text fz={13} fw={500} c="#333" style={{ flex: 1 }}>{label}</Text>
                  <IconArrowRight size={13} color="#ccc" />
                </Group>
              </Anchor>
            ))}
          </Stack>
        </Paper>
      </SimpleGrid>

      {/* ── Analytics charts ─────────────────────────── */}
      <AnalyticsSection />

      {/* ── Recent Orders table ─────────────────────── */}
      <Paper radius="md" shadow="xs" style={{ background: "#fff", border: "1px solid #f1f3f5", overflow: "hidden" }}>
        <Group justify="space-between" p="md" style={{ borderBottom: "1px solid #f8f9fa" }}>
          <Text fw={700} fz={14} c="#111">Recent Orders</Text>
          <Anchor component={Link} href="/admin/orders" fz={12} c={ORANGE} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            View all <IconArrowRight size={12} />
          </Anchor>
        </Group>
        {recentOrders.length === 0
          ? <Text c="dimmed" fz="sm" ta="center" py="xl">No orders yet</Text>
          : <Box style={{ overflowX: "auto" }}>
              <Table highlightOnHover horizontalSpacing="md" verticalSpacing="sm">
                <Table.Thead style={{ background: "#fafafa" }}>
                  <Table.Tr>
                    {["Customer", "Order ID", "Date", "Total", "Status", "Contact"].map(h => (
                      <Table.Th key={h} style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {recentOrders.map(order => {
                    const meta = STATUS_META[order.status] ?? { mantine: "gray", icon: null };
                    return (
                      <Table.Tr key={order.id} style={{ borderBottom: "1px solid #f8f9fa" }}>
                        <Table.Td>
                          <Text fz={13} fw={600} c="#222">{order.delivery_name ?? "Guest"}</Text>
                          {order.delivery_city && <Text fz={11} c="#9ca3af">{order.delivery_city}</Text>}
                        </Table.Td>
                        <Table.Td>
                          <Text fz={12} c={ORANGE} fw={600} style={{ fontFamily: "monospace" }}>
                            AFM-{order.id.replace(/-/g, "").slice(-8).toUpperCase()}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fz={12} c="#9ca3af">{new Date(order.created_at).toLocaleDateString("fr-SN")}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text fz={13} fw={700} c="#222">{Number(order.total).toLocaleString("fr-SN")} CFA</Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge size="sm" color={meta.mantine} variant="light" radius="sm" leftSection={meta.icon}>
                            {order.status}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          {order.delivery_phone && (
                            <Tooltip label={`WhatsApp ${order.delivery_name}`} withArrow>
                              <ActionIcon size="sm" variant="light" color="green" radius="md"
                                component="a"
                                href={`https://wa.me/${order.delivery_phone.replace(/\D/g, "")}?text=Hello+${encodeURIComponent(order.delivery_name ?? "")}%2C+this+is+Afmondo+regarding+your+order.`}
                                target="_blank">
                                <IconBrandWhatsapp size={14} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Box>
        }
      </Paper>
    </Box>
  );
}
