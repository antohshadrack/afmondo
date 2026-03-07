"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Box, Title, Text, Group, Badge, Select, TextInput,
  Skeleton, Stack, Button, ActionIcon, Tabs, Tooltip,
  Paper, SimpleGrid, NumberFormatter, Modal, Divider,
  Menu, Checkbox, UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconSearch, IconBrandWhatsapp, IconPhone,
  IconDownload, IconCheck, IconFilter,
  IconChevronDown, IconEye, IconRefresh,
  IconShoppingBag, IconClock, IconTruck,
  IconCircleCheck, IconX, IconAlertTriangle,
} from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import type { DbOrder, DbOrderItem } from "@/lib/supabase/queries";

/* ── Constants ───────────────────────────────────────────── */
const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "dispatched", label: "Dispatched" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

const STATUS_META: Record<string, { color: string; icon: React.ReactNode }> = {
  pending:    { color: "yellow",  icon: <IconClock size={12} /> },
  confirmed:  { color: "blue",   icon: <IconCheck size={12} /> },
  processing: { color: "cyan",   icon: <IconRefresh size={12} /> },
  dispatched: { color: "orange", icon: <IconTruck size={12} /> },
  delivered:  { color: "green",  icon: <IconCircleCheck size={12} /> },
  cancelled:  { color: "red",    icon: <IconX size={12} /> },
  refunded:   { color: "gray",   icon: <IconAlertTriangle size={12} /> },
};

function shortId(id: string) {
  return "AFM-" + id.replace(/-/g, "").slice(-8).toUpperCase();
}

function exportCSV(orders: DbOrder[]) {
  const rows = [
    ["Order ID", "Customer", "Phone", "City", "Total (CFA)", "Status", "Date"],
    ...orders.map((o) => [
      shortId(o.id),
      o.delivery_name ?? "",
      o.delivery_phone ?? "",
      o.delivery_city ?? "",
      o.total,
      o.status,
      new Date(o.created_at).toLocaleDateString("fr-SN"),
    ]),
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `orders-${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
}

/* ── Order Detail Modal ──────────────────────────────────── */
function OrderDetailModal({ order, onClose, onStatusChange }: {
  order: DbOrder | null;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  if (!order) return null;
  const meta = STATUS_META[order.status] ?? { color: "gray", icon: null };
  return (
    <Modal opened={!!order} onClose={onClose} title={
      <Group gap="xs">
        <Text fw={700}>Order {shortId(order.id)}</Text>
        <Badge color={meta.color} variant="light" leftSection={meta.icon}>{order.status}</Badge>
      </Group>
    } size="lg" radius="lg">
      <Stack gap="md">
        {/* Customer info */}
        <Paper radius="md" p="md" bg="gray.0">
          <Text fw={600} fz="sm" mb="xs">Customer</Text>
          <Stack gap={4}>
            <Group gap="xs"><Text fz="sm" fw={500}>{order.delivery_name ?? "—"}</Text></Group>
            {order.delivery_phone && (
              <Group gap="xs">
                <Text fz="sm" c="dimmed">{order.delivery_phone}</Text>
                <ActionIcon
                  component="a"
                  href={`https://wa.me/${order.delivery_phone.replace(/\D/g, "")}`}
                  target="_blank"
                  size="sm" variant="light" color="green" radius="md"
                >
                  <IconBrandWhatsapp size={14} />
                </ActionIcon>
                <ActionIcon
                  component="a"
                  href={`tel:${order.delivery_phone}`}
                  size="sm" variant="light" color="blue" radius="md"
                >
                  <IconPhone size={14} />
                </ActionIcon>
              </Group>
            )}
            {order.delivery_city && <Text fz="sm" c="dimmed">{order.delivery_city}{order.delivery_address ? `, ${order.delivery_address}` : ""}</Text>}
            {order.notes && <Text fz="xs" c="dimmed" mt={2}>📝 {order.notes}</Text>}
          </Stack>
        </Paper>

        {/* Items */}
        <Box>
          <Text fw={600} fz="sm" mb="xs">Items</Text>
          <Stack gap="xs">
            {(order.order_items ?? []).map((item: DbOrderItem) => (
              <Group key={item.id} justify="space-between" p="xs" style={{ border: "1px solid var(--mantine-color-gray-2)", borderRadius: 8 }}>
                <Box>
                  <Text fz="sm" fw={500}>{item.name}</Text>
                  <Text fz="xs" c="dimmed">Qty: {item.quantity} × {Number(item.price).toLocaleString("fr-SN")} CFA</Text>
                </Box>
                <Text fz="sm" fw={700}>{(item.price * item.quantity).toLocaleString("fr-SN")} CFA</Text>
              </Group>
            ))}
          </Stack>
          <Divider my="sm" />
          <Group justify="space-between">
            <Text fw={700}>Total</Text>
            <Text fw={800} c="orange.6">{Number(order.total).toLocaleString("fr-SN")} CFA</Text>
          </Group>
        </Box>

        {/* Status change */}
        <Box>
          <Text fw={600} fz="sm" mb="xs">Update Status</Text>
          <Group>
            {STATUS_OPTIONS.map(({ value, label }) => {
              const m = STATUS_META[value] ?? { color: "gray" };
              return (
                <Button
                  key={value}
                  size="xs"
                  radius="md"
                  variant={order.status === value ? "filled" : "light"}
                  color={m.color}
                  onClick={() => onStatusChange(order.id, value)}
                >
                  {label}
                </Button>
              );
            })}
          </Group>
        </Box>
      </Stack>
    </Modal>
  );
}

/* ── Main Page ────────────────────────────────────────────── */
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detailOrder, setDetailOrder] = useState<DbOrder | null>(null);
  const supabase = createClient();

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
      .limit(200);
    setOrders((data as DbOrder[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  // ── Auto-refresh when orders change ──────────────────────
  useEffect(() => {
    const ch = supabase.channel("orders-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  /* ── In-memory filter ───────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = orders;
    if (statusFilter !== "all") list = list.filter((o) => o.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) =>
        o.delivery_name?.toLowerCase().includes(q) ||
        o.delivery_phone?.toLowerCase().includes(q) ||
        shortId(o.id).toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, statusFilter, search]);

  /* ── Status counts for tabs ─────────────────────────────── */
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders.length };
    orders.forEach((o) => { c[o.status] = (c[o.status] ?? 0) + 1; });
    return c;
  }, [orders]);

  /* ── Revenue stats ──────────────────────────────────────── */
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayRevenue = orders
      .filter((o) => new Date(o.created_at).toDateString() === today && o.status !== "cancelled" && o.status !== "refunded")
      .reduce((s, o) => s + Number(o.total), 0);
    const totalRevenue = orders
      .filter((o) => o.status === "delivered")
      .reduce((s, o) => s + Number(o.total), 0);
    return { todayRevenue, totalRevenue, pending: counts["pending"] ?? 0 };
  }, [orders, counts]);

  /* ── Actions ─────────────────────────────────────────────── */
  const handleStatusChange = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) { notifications.show({ title: "Error", message: error.message, color: "red" }); return; }
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    if (detailOrder?.id === orderId) setDetailOrder((prev) => prev ? { ...prev, status } : prev);
    notifications.show({ title: "Updated", message: `Status → ${status}`, color: "green", icon: <IconCheck size={14} /> });
  };

  const handleBulkStatus = async (status: string) => {
    for (const id of selectedIds) await handleStatusChange(id, status);
    setSelectedIds([]);
  };

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const toggleAll = () =>
    setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map((o) => o.id));

  return (
    <Box p="xl">
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <Box>
          <Text fz={11} fw={600} c="#9ca3af" style={{ textTransform: "uppercase", letterSpacing: "0.06em" }} mb={2}>
            Manage
          </Text>
          <Text fz={22} fw={800} c="#111" lh={1}>Orders</Text>
        </Box>
        <Group>
          <Button
            leftSection={<IconRefresh size={14} />}
            variant="default" size="sm" radius="md"
            onClick={fetchOrders} loading={loading}
            style={{ borderColor: "#e9ecef", color: "#555" }}
          >
            Refresh
          </Button>
          <Button
            leftSection={<IconDownload size={14} />}
            variant="default" size="sm" radius="md"
            onClick={() => exportCSV(filtered)}
            disabled={filtered.length === 0}
            style={{ borderColor: "#e9ecef", color: "#555" }}
          >
            Export CSV
          </Button>
        </Group>
      </Group>

      {/* Stats Row */}
      <SimpleGrid cols={{ base: 2, sm: 3 }} mb="lg" spacing="md">
        {[
          { label: "Pending",         value: stats.pending,                                      color: "#f59e0b", bg: "#fff3e0", sub: "awaiting action" },
          { label: "Today's Revenue", value: `${stats.todayRevenue.toLocaleString("fr-SN")} CFA`, color: "#10b981", bg: "#ecfdf5", sub: "non-cancelled" },
          { label: "Delivered Revenue",value: `${stats.totalRevenue.toLocaleString("fr-SN")} CFA`, color: "#3b82f6", bg: "#eff6ff", sub: "confirmed revenue" },
        ].map(s => (
          <Paper key={s.label} radius="md" p="md" shadow="xs" style={{ background: "#fff", border: "1px solid #f1f3f5", borderLeft: `3px solid ${s.color}` }}>
            <Text fz={11} fw={600} style={{ color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</Text>
            <Text fw={800} fz={20} mt={4} c="#111">{s.value}</Text>
            <Text fz={11} c="#9ca3af" mt={2}>{s.sub}</Text>
          </Paper>
        ))}
      </SimpleGrid>

      {/* Search + Bulk actions */}
      <Group mb="md" gap="sm" wrap="wrap">
        <TextInput
          placeholder="Search by name, phone, order ID…"
          leftSection={<IconSearch size={14} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ flex: 1, minWidth: 200 }}
          radius="md"
          size="sm"
        />
        {selectedIds.length > 0 && (
          <Menu shadow="md" radius="md">
            <Menu.Target>
              <Button size="sm" color="orange" radius="md" rightSection={<IconChevronDown size={14} />}>
                {selectedIds.length} selected
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Bulk update status</Menu.Label>
              {STATUS_OPTIONS.map(({ value, label }) => (
                <Menu.Item key={value} onClick={() => handleBulkStatus(value)}>{label}</Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>

      {/* Status tabs */}
      <Tabs value={statusFilter} onChange={(v) => setStatusFilter(v ?? "all")} mb="md">
        <Tabs.List>
          <Tabs.Tab value="all">All <Badge size="xs" ml={4} variant="light">{counts.all}</Badge></Tabs.Tab>
          {STATUS_OPTIONS.map(({ value, label }) => counts[value] ? (
            <Tabs.Tab key={value} value={value} color={STATUS_META[value]?.color ?? "gray"}>
              {label} <Badge size="xs" ml={4} variant="light" color={STATUS_META[value]?.color ?? "gray"}>{counts[value]}</Badge>
            </Tabs.Tab>
          ) : null)}
        </Tabs.List>
      </Tabs>

      {/* Orders list */}
      {loading ? (
        <Stack gap="xs">{Array(6).fill(0).map((_, i) => <Skeleton key={i} height={72} radius="md" />)}</Stack>
      ) : filtered.length === 0 ? (
        <Text c="dimmed" ta="center" py={60}>No orders found.</Text>
      ) : (
        <Paper radius="lg" shadow="xs" style={{ overflow: "hidden" }}>
          {/* Table header */}
          <Box px="md" py="xs" bg="gray.0" style={{ borderBottom: "1px solid var(--mantine-color-gray-2)", display: "grid", gridTemplateColumns: "36px 2fr 1fr 1fr 1fr 120px 56px", gap: 8, alignItems: "center" }}>
            <Checkbox checked={selectedIds.length === filtered.length && filtered.length > 0} indeterminate={selectedIds.length > 0 && selectedIds.length < filtered.length} onChange={toggleAll} size="xs" />
            <Text fz="xs" fw={600} tt="uppercase" c="dimmed">Customer</Text>
            <Text fz="xs" fw={600} tt="uppercase" c="dimmed">Order ID</Text>
            <Text fz="xs" fw={600} tt="uppercase" c="dimmed">Date</Text>
            <Text fz="xs" fw={600} tt="uppercase" c="dimmed">Total</Text>
            <Text fz="xs" fw={600} tt="uppercase" c="dimmed">Status</Text>
            <Text fz="xs" fw={600} tt="uppercase" c="dimmed">Actions</Text>
          </Box>

          {filtered.map((order, i) => {
            const meta = STATUS_META[order.status] ?? { color: "gray", icon: null };
            const selected = selectedIds.includes(order.id);
            return (
              <Box
                key={order.id}
                px="md"
                py="sm"
                style={{
                  display: "grid",
                  gridTemplateColumns: "36px 2fr 1fr 1fr 1fr 120px 56px",
                  gap: 8,
                  alignItems: "center",
                  borderBottom: i < filtered.length - 1 ? "1px solid var(--mantine-color-gray-1)" : undefined,
                  backgroundColor: selected ? "var(--mantine-color-orange-0)" : undefined,
                  transition: "background 100ms",
                }}
              >
                <Checkbox checked={selected} onChange={() => toggleSelect(order.id)} size="xs" onClick={(e) => e.stopPropagation()} />

                {/* Customer */}
                <Box>
                  <Text fz="sm" fw={600} lineClamp={1}>{order.delivery_name ?? "Guest"}</Text>
                  {order.delivery_phone && <Text fz="xs" c="dimmed">{order.delivery_phone}</Text>}
                </Box>

                {/* Short ID */}
                <Text fz="xs" style={{ fontFamily: "monospace" }} c="dimmed">{shortId(order.id)}</Text>

                {/* Date */}
                <Text fz="xs" c="dimmed">{new Date(order.created_at).toLocaleDateString("fr-SN")}</Text>

                {/* Total */}
                <Text fz="sm" fw={700} c="orange.6">{Number(order.total).toLocaleString("fr-SN")} CFA</Text>

                {/* Status select */}
                <Select
                  size="xs"
                  radius="sm"
                  value={order.status}
                  data={STATUS_OPTIONS}
                  onChange={(v) => { if (v) handleStatusChange(order.id, v); }}
                />

                {/* Actions */}
                <Group gap={4}>
                  <Tooltip label="View details">
                    <ActionIcon size="sm" variant="subtle" color="gray" onClick={() => setDetailOrder(order)}>
                      <IconEye size={14} />
                    </ActionIcon>
                  </Tooltip>
                  {order.delivery_phone && (
                    <Tooltip label="WhatsApp">
                      <ActionIcon
                        size="sm" variant="subtle" color="green"
                        component="a"
                        href={`https://wa.me/${order.delivery_phone.replace(/\D/g, "")}?text=Hello+${encodeURIComponent(order.delivery_name ?? "")}%2C+regarding+your+order+${shortId(order.id)}+at+Afmondo.`}
                        target="_blank"
                      >
                        <IconBrandWhatsapp size={14} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>
              </Box>
            );
          })}
        </Paper>
      )}

      {/* Detail modal */}
      <OrderDetailModal
        order={detailOrder}
        onClose={() => setDetailOrder(null)}
        onStatusChange={handleStatusChange}
      />
    </Box>
  );
}
