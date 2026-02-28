"use client";

import { useEffect, useState } from "react";
import {
  Box, Title, Text, Group, NumberInput, Button,
  Badge, Skeleton, Stack, Progress,
} from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import type { DbInventory } from "@/lib/supabase/queries";
import { notifications } from "@mantine/notifications";
import Image from "next/image";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<DbInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, number>>({});
  const supabase = createClient();

  const fetchInventory = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("inventory")
      .select("*, products(id, name, slug, images, price)")
      .order("quantity", { ascending: true });
    setInventory((data as DbInventory[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchInventory(); }, []);

  const handleSave = async (inv: DbInventory) => {
    const newQty = editing[inv.id] ?? inv.quantity;
    const { error } = await supabase.from("inventory").update({
      quantity: newQty,
      updated_at: new Date().toISOString(),
    }).eq("id", inv.id);

    if (error) {
      notifications.show({ title: "Error", message: error.message, color: "red" });
    } else {
      notifications.show({ title: "Updated", message: "Inventory saved", color: "green" });
      setEditing((prev) => { const copy = { ...prev }; delete copy[inv.id]; return copy; });
      fetchInventory();
    }
  };

  const lowStock = inventory.filter((i) => i.quantity <= i.low_stock_threshold);

  return (
    <Box p={{ base: "md", md: "xl" }}>
      <Box mb="xl" pb="md" style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}>
        <Text fz="xs" tt="uppercase" c="dimmed" style={{ letterSpacing: 1.5 }}>Admin</Text>
        <Title order={2} fw={800} fz="xl" mt={4}>Inventory</Title>
      </Box>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <Box
          mb="lg"
          p="md"
          style={{
            border: "1px solid var(--mantine-color-orange-3)",
            borderRadius: 8,
            backgroundColor: "var(--mantine-color-orange-0)",
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <IconAlertTriangle size={18} style={{ color: "var(--afmondo-orange)", flexShrink: 0 }} />
          <Text fz="sm" fw={500}>
            {lowStock.length} item{lowStock.length > 1 ? "s" : ""} below the low-stock threshold. Restock soon.
          </Text>
        </Box>
      )}

      {loading ? (
        <Stack gap="sm">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} height={72} radius="md" />)}
        </Stack>
      ) : inventory.length === 0 ? (
        <Text c="dimmed" ta="center" py={60}>No inventory data yet. Add products and set stock levels.</Text>
      ) : (
        <Box style={{ border: "1px solid var(--mantine-color-gray-2)", borderRadius: 8, backgroundColor: "white", overflow: "hidden" }}>
          {inventory.map((inv, i) => {
            const product = inv.products as DbInventory["products"];
            const isLow = inv.quantity <= inv.low_stock_threshold;
            const pct = Math.min(100, Math.round((inv.quantity / Math.max(inv.low_stock_threshold * 4, 1)) * 100));

            return (
              <Box
                key={inv.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 16px",
                  borderBottom: i < inventory.length - 1 ? "1px solid var(--mantine-color-gray-1)" : undefined,
                }}
              >
                {/* Thumbnail */}
                <Box style={{ width: 44, height: 44, borderRadius: 6, overflow: "hidden", backgroundColor: "var(--mantine-color-gray-1)", flexShrink: 0, position: "relative" }}>
                  {product?.images?.[0] && (
                    <Image src={product.images[0]} alt={product.name ?? ""} fill style={{ objectFit: "cover" }} />
                  )}
                </Box>

                {/* Name + progress */}
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text fz="sm" fw={600} lineClamp={1}>{product?.name ?? "Unknown product"}</Text>
                  <Progress
                    value={pct}
                    size="xs"
                    mt={4}
                    color={isLow ? "red" : "green"}
                    style={{ maxWidth: 200 }}
                  />
                </Box>

                {/* Status badge */}
                <Badge
                  size="xs"
                  radius="sm"
                  variant="light"
                  color={inv.quantity === 0 ? "red" : isLow ? "orange" : "green"}
                  visibleFrom="sm"
                >
                  {inv.quantity === 0 ? "Out of stock" : isLow ? "Low stock" : "In stock"}
                </Badge>

                {/* Quantity editor */}
                <Group gap="xs" style={{ flexShrink: 0 }}>
                  <NumberInput
                    value={editing[inv.id] ?? inv.quantity}
                    onChange={(v) => setEditing((prev) => ({ ...prev, [inv.id]: typeof v === "number" ? v : 0 }))}
                    min={0}
                    size="xs"
                    radius="sm"
                    style={{ width: 80 }}
                  />
                  {editing[inv.id] !== undefined && editing[inv.id] !== inv.quantity && (
                    <Button size="xs" color="orange" radius="sm" onClick={() => handleSave(inv)}>Save</Button>
                  )}
                </Group>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
