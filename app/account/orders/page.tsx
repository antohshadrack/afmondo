"use client";

import { useState, useEffect } from "react";
import { Box, Paper, Title, Text, Group, Badge, Stack, Grid, Divider, Center, Button } from "@mantine/core";
import { IconPackage, IconExternalLink } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import type { DbOrder, DbOrderItem } from "@/lib/supabase/queries";
import Link from "next/link";
import Image from "next/image";

type FullOrder = DbOrder & { items: DbOrderItem[] };

export default function OrdersPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<FullOrder[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("orders")
        .select(`
          *,
          items:order_items(*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setOrders(data as FullOrder[]);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "yellow";
      case "confirmed": return "blue";
      case "processing": return "grape";
      case "dispatched": return "violet";
      case "delivered": return "green";
      case "cancelled": return "red";
      case "refunded": return "gray";
      default: return "gray";
    }
  };

  if (loading) {
    return (
      <Paper withBorder radius="md" p="xl" bg="white">
        <Text c="dimmed">Loading orders...</Text>
      </Paper>
    );
  }

  if (orders.length === 0) {
    return (
      <Paper withBorder radius="md" p="xl" bg="white">
        <Center style={{ flexDirection: "column", minHeight: 400 }}>
          <IconPackage size={64} color="var(--mantine-color-gray-4)" stroke={1} />
          <Title order={3} mt="md" mb="xs">No Orders Yet</Title>
          <Text c="dimmed" mb="xl">You haven't placed any orders yet.</Text>
          <Button component={Link} href="/" color="orange">Start Shopping</Button>
        </Center>
      </Paper>
    );
  }

  return (
    <Stack gap="lg">
      <Paper withBorder radius="md" p="xl" bg="white">
        <Title order={3} mb="xs">My Orders</Title>
        <Text c="dimmed" fz="sm">View your recent order history and status.</Text>
      </Paper>

      {orders.map((order) => (
        <Paper key={order.id} withBorder radius="md" p="xl" bg="white">
          <Group justify="space-between" align="flex-start" mb="md">
            <Box>
              <Group gap="xs">
                <Text fw={700}>Order #{order.id.slice(0, 8)}</Text>
                <Badge color={getStatusColor(order.status)} variant="light">
                  {order.status}
                </Badge>
              </Group>
              <Text c="dimmed" fz="xs" mt={4}>
                 Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </Box>
            <Text fw={800} fz="xl" c="orange.7">
              {Number(order.total).toLocaleString()} CFA
            </Text>
          </Group>

          <Divider my="md" />

          <Stack gap="md">
            {order.items.map((item) => (
              <Grid key={item.id} align="center">
                <Grid.Col span={{ base: 2, md: 1 }}>
                  <Box style={{ width: 48, height: 48, position: "relative", borderRadius: 8, overflow: "hidden", border: "1px solid var(--mantine-color-gray-2)" }}>
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                    ) : (
                      <Box bg="gray.1" style={{ width: "100%", height: "100%" }} />
                    )}
                  </Box>
                </Grid.Col>
                <Grid.Col span={{ base: 6, md: 8 }}>
                  <Text fw={500} lineClamp={1} fz="sm">{item.name}</Text>
                  <Text c="dimmed" fz="xs">Qty: {item.quantity}</Text>
                </Grid.Col>
                <Grid.Col span={{ base: 4, md: 3 }} style={{ textAlign: "right" }}>
                  <Text fw={600} fz="sm">{Number(item.price * item.quantity).toLocaleString()} CFA</Text>
                </Grid.Col>
              </Grid>
            ))}
          </Stack>

          {/* Delivery Info */}
          <Box mt="xl" p="md" bg="gray.0" style={{ borderRadius: 8 }}>
            <Text fw={600} fz="sm" mb="xs">Delivery Destination</Text>
            <Text fz="sm">{order.delivery_name}</Text>
            <Text fz="sm">{order.delivery_phone}</Text>
            <Text fz="sm" c="dimmed">{order.delivery_address}, {order.delivery_city}</Text>
          </Box>
        </Paper>
      ))}
    </Stack>
  );
}
