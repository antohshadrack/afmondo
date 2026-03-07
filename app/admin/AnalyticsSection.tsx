"use client";

import { useEffect, useState } from "react";
import {
  Box, Text, Paper, Group, Skeleton, SimpleGrid, Badge, Progress,
} from "@mantine/core";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTip,
  ResponsiveContainer, LineChart, Line, AreaChart, Area, Cell,
} from "recharts";
import {
  getMonthlyRevenue, getOrdersByCity, getTopProducts, getTopPages,
  type MonthlyRevenue, type CityOrders, type TopProduct, type PageViewStat,
} from "@/lib/supabase/queries";
import { IconTrendingUp, IconMapPin, IconPackage, IconFileText } from "@tabler/icons-react";

const ORANGE = "#f5a623";
const CARD   = { background: "#fff", border: "1px solid #f1f3f5" };

/* ── Tooltip for revenue chart ───────────────────────────── */
function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <Box style={{ background: "#fff", border: "1px solid #f1f3f5", borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
      <Text fz={12} fw={700} c="#333" mb={4}>{label}</Text>
      <Text fz={12} c={ORANGE}>{Number(payload[0]?.value ?? 0).toLocaleString("fr-SN")} CFA</Text>
      <Text fz={11} c="#9ca3af">{payload[1]?.value ?? 0} orders</Text>
    </Box>
  );
}

/* ── Section header ──────────────────────────────────────── */
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <Group gap={8} mb="md">
      <Box style={{ color: ORANGE }}>{icon}</Box>
      <Text fw={700} fz={14} c="#111">{title}</Text>
    </Group>
  );
}

/* ── Main analytics section ──────────────────────────────── */
export default function AnalyticsSection() {
  const [monthly,  setMonthly]  = useState<MonthlyRevenue[]>([]);
  const [cities,   setCities]   = useState<CityOrders[]>([]);
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [pages,    setPages]    = useState<PageViewStat[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([getMonthlyRevenue(12), getOrdersByCity(8), getTopProducts(6), getTopPages(10)])
      .then(([m, c, p, pg]) => {
        setMonthly(m); setCities(c); setProducts(p); setPages(pg);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg" mt="lg">
      {Array(4).fill(0).map((_, i) => <Skeleton key={i} h={260} radius="md" />)}
    </SimpleGrid>
  );

  const maxCity = Math.max(...cities.map(c => c.count), 1);
  const maxProduct = Math.max(...products.map(p => p.orders), 1);
  const totalViews = pages.reduce((s, p) => s + p.views, 0);

  return (
    <Box mt="lg">
      {/* ── Row 1: Revenue chart + Orders by city ─── */}
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg" mb="lg">

        {/* Revenue over time */}
        <Paper radius="md" p="lg" shadow="xs" style={CARD}>
          <SectionHeader icon={<IconTrendingUp size={16} />} title="Revenue Over Time" />
          {monthly.length === 0
            ? <Text c="dimmed" fz="sm" ta="center" py="xl">No revenue data yet</Text>
            : <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthly} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={ORANGE} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={ORANGE} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false}
                    tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                  <RechartsTip content={<RevenueTooltip />} cursor={{ stroke: ORANGE, strokeWidth: 1, strokeDasharray: "4 4" }} />
                  <Area type="monotone" dataKey="revenue" stroke={ORANGE} strokeWidth={2}
                    fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: ORANGE }} />
                </AreaChart>
              </ResponsiveContainer>
          }
        </Paper>

        {/* Orders by city */}
        <Paper radius="md" p="lg" shadow="xs" style={CARD}>
          <SectionHeader icon={<IconMapPin size={16} />} title="Orders by Location" />
          {cities.length === 0
            ? <Text c="dimmed" fz="sm" ta="center" py="xl">No location data yet</Text>
            : <Box style={{ overflowY: "auto", maxHeight: 220 }}>
                <Box style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {cities.map((c) => {
                    const pct = Math.round((c.count / maxCity) * 100);
                    return (
                      <Box key={c.city}>
                        <Group justify="space-between" mb={4}>
                          <Group gap={6}>
                            <Box style={{ width: 7, height: 7, borderRadius: "50%", background: ORANGE, flexShrink: 0 }} />
                            <Text fz={12} fw={500} c="#333">{c.city}</Text>
                          </Group>
                          <Group gap={8}>
                            <Text fz={11} c="#9ca3af">{c.revenue.toLocaleString("fr-SN")} CFA</Text>
                            <Badge size="xs" variant="light" color="orange" radius="sm">{c.count} orders</Badge>
                          </Group>
                        </Group>
                        <Progress value={pct} size={5} color="orange" radius="xl"
                          styles={{ root: { backgroundColor: "#f3f4f6" } }} />
                      </Box>
                    );
                  })}
                </Box>
              </Box>
          }
        </Paper>
      </SimpleGrid>

      {/* ── Row 2: Top products bar chart + Top pages ── */}
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">

        {/* Top products */}
        <Paper radius="md" p="lg" shadow="xs" style={CARD}>
          <SectionHeader icon={<IconPackage size={16} />} title="Top Products (by orders)" />
          {products.length === 0
            ? <Text c="dimmed" fz="sm" ta="center" py="xl">No order items yet</Text>
            : <ResponsiveContainer width="100%" height={220}>
                <BarChart data={products} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={110}
                    tick={{ fontSize: 11, fill: "#444" }} axisLine={false} tickLine={false}
                    tickFormatter={v => v.length > 14 ? v.slice(0, 14) + "…" : v} />
                  <RechartsTip
                    formatter={(val: any) => [`${val} sold`, "Orders"]}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #f1f3f5" }}
                  />
                  <Bar dataKey="orders" radius={[0, 4, 4, 0]} maxBarSize={18}>
                    {products.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? ORANGE : `rgba(245,166,35,${0.75 - i * 0.08})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
          }
        </Paper>

        {/* Top pages */}
        <Paper radius="md" p="lg" shadow="xs" style={CARD}>
          <Group justify="space-between" mb="md">
            <Group gap={8}>
              <Box style={{ color: ORANGE }}><IconFileText size={16} /></Box>
              <Text fw={700} fz={14} c="#111">Top Pages</Text>
            </Group>
            {totalViews > 0 && <Text fz={11} c="#9ca3af">{totalViews.toLocaleString()} total views</Text>}
          </Group>
          {pages.length === 0
            ? <Box>
                <Text c="dimmed" fz="sm" ta="center" py="md">No page views tracked yet.</Text>
                <Text fz={11} c="#9ca3af" ta="center">
                  Add the page tracker to your storefront layout to start seeing data.
                </Text>
              </Box>
            : <>
                <Box style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "0 16px", borderBottom: "1px solid #f3f4f6", paddingBottom: 6, marginBottom: 6 }}>
                  <Text fz={10} fw={700} c="#9ca3af" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Page</Text>
                  <Text fz={10} fw={700} c="#9ca3af" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Views</Text>
                  <Text fz={10} fw={700} c="#9ca3af" style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>%</Text>
                </Box>
                <Box style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 180, overflowY: "auto" }}>
                  {pages.map((pg) => {
                    const pct = totalViews ? Math.round((pg.views / totalViews) * 100) : 0;
                    return (
                      <Box key={pg.path} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "0 16px", alignItems: "center" }}>
                        <Text fz={12} c="#333" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {pg.path === "/" ? "Home" : pg.path}
                        </Text>
                        <Text fz={12} fw={600} c="#111" ta="right">{pg.views.toLocaleString()}</Text>
                        <Badge size="xs" variant="light" color={pct > 20 ? "orange" : "gray"} radius="sm"
                          style={{ minWidth: 36, justifyContent: "center" }}>{pct}%</Badge>
                      </Box>
                    );
                  })}
                </Box>
              </>
          }
        </Paper>
      </SimpleGrid>
    </Box>
  );
}
