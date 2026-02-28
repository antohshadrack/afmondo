"use client";

import { useEffect, useState } from "react";
import {
  Box, Title, Text, Group, Badge, Select,
  Skeleton, Stack, Anchor,
} from "@mantine/core";
import { createClient } from "@/lib/supabase/client";
import type { DbOrder, DbOrderItem } from "@/lib/supabase/queries";
import { notifications } from "@mantine/notifications";
import Link from "next/link";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "dispatched", label: "Dispatched" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

const STATUS_COLORS: Record<string, string> = {
  pending: "yellow", confirmed: "blue", processing: "cyan",
  dispatched: "orange", delivered: "green", cancelled: "red", refunded: "gray",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const supabase = createClient();

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
      .limit(50);
    setOrders((data as DbOrder[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", orderId);
    if (error) {
      notifications.show({ title: "Error", message: error.message, color: "red" });
    } else {
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    }
  };

  return (
    <Box p={{ base: "md", md: "xl" }}>
      <Box mb="xl" pb="md" style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}>
        <Text fz="xs" tt="uppercase" c="dimmed" style={{ letterSpacing: 1.5 }}>Admin</Text>
        <Title order={2} fw={800} fz="xl" mt={4}>Orders</Title>
      </Box>

      {loading ? (
        <Stack gap="sm">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} height={72} radius="md" />)}
        </Stack>
      ) : orders.length === 0 ? (
        <Text c="dimmed" ta="center" py={60}>No orders yet.</Text>
      ) : (
        <Box style={{ border: "1px solid var(--mantine-color-gray-2)", borderRadius: 8, backgroundColor: "white", overflow: "hidden" }}>
          {orders.map((order, i) => (
            <Box key={order.id}>
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--mantine-color-gray-1)",
                  cursor: "pointer",
                  flexWrap: "wrap",
                }}
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                {/* Order ID + date */}
                <Box style={{ flex: "1 1 200px", minWidth: 0 }}>
                  <Text fz="xs" c="dimmed" style={{ fontFamily: "monospace" }}>#{order.id.slice(0, 8).toUpperCase()}</Text>
                  <Text fz="sm" fw={600}>{order.delivery_name ?? "Guest"}</Text>
                  <Text fz="xs" c="dimmed">{new Date(order.created_at).toLocaleDateString("fr-SN")}</Text>
                </Box>

                {/* Total */}
                <Text fz="sm" fw={700} c="orange.6" style={{ flexShrink: 0 }}>
                  {Number(order.total).toLocaleString("fr-SN")} CFA
                </Text>

                {/* Status selector */}
                <Select
                  size="xs"
                  radius="sm"
                  value={order.status}
                  data={STATUS_OPTIONS}
                  onChange={(v) => { if (v) handleStatusChange(order.id, v); }}
                  style={{ width: 140, flexShrink: 0 }}
                  onClick={(e) => e.stopPropagation()}
                />

                <Badge size="sm" color={STATUS_COLORS[order.status] ?? "gray"} radius="sm" variant="light">
                  {order.status}
                </Badge>
              </Box>

              {/* Expanded order items */}
              {expanded === order.id && (
                <Box px="lg" py="md" style={{ backgroundColor: "var(--mantine-color-gray-0)", borderBottom: i < orders.length - 1 ? "1px solid var(--mantine-color-gray-2)" : undefined }}>
                  <Stack gap="xs">
                    {order.delivery_phone && (
                      <Text fz="xs" c="dimmed">📞 {order.delivery_phone} · {order.delivery_address}, {order.delivery_city}</Text>
                    )}
                    {(order.order_items ?? []).map((item: DbOrderItem) => (
                      <Group key={item.id} justify="space-between">
                        <Text fz="sm">{item.quantity}× {item.name}</Text>
                        <Text fz="sm" fw={600}>{Number(item.price * item.quantity).toLocaleString("fr-SN")} CFA</Text>
                      </Group>
                    ))}
                    <Box style={{ borderTop: "1px dashed var(--mantine-color-gray-3)", marginTop: 4, paddingTop: 4 }}>
                      <Group justify="space-between">
                        <Text fz="sm" fw={700}>Total</Text>
                        <Text fz="sm" fw={700} c="orange.6">{Number(order.total).toLocaleString("fr-SN")} CFA</Text>
                      </Group>
                    </Box>
                  </Stack>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
