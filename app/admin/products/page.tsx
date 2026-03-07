"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Box, Title, Text, Button, Group, Badge, TextInput,
  ActionIcon, Skeleton, Menu, Checkbox, Select,
  Paper, Transition,
} from "@mantine/core";
import {
  IconPlus, IconSearch, IconDots, IconEdit, IconTrash,
  IconEye, IconEyeOff, IconCircleCheck, IconPackageOff,
} from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import type { DbProduct } from "@/lib/supabase/queries";
import { notifications } from "@mantine/notifications";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const supabase = createClient();

  const fetchProducts = async () => {
    setLoading(true);
    let q = supabase.from("products").select("*").order("created_at", { ascending: false });
    if (search) q = q.ilike("name", `%${search}%`);
    if (filter === "active") q = q.eq("is_active", true);
    if (filter === "inactive") q = q.eq("is_active", false);
    if (filter === "flash") q = q.eq("is_flash_sale", true);
    if (filter === "featured") q = q.eq("is_featured", true);
    const { data } = await q;
    setProducts(data ?? []);
    setSelected(new Set());
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [search, filter]);

  // ── Realtime: auto-refresh when any product changes ─────────────
  useEffect(() => {
    const ch = supabase.channel("products-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        fetchProducts();
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  // ── Single row actions ─────────────────────────────────────────
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { notifications.show({ title: "Error", message: error.message, color: "red" }); }
    else { notifications.show({ title: "Deleted", message: `"${name}" removed`, color: "green" }); fetchProducts(); }
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("products").update({ is_active: !current }).eq("id", id);
    fetchProducts();
  };

  // ── Bulk actions ───────────────────────────────────────────────
  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === products.length) { setSelected(new Set()); }
    else { setSelected(new Set(products.map((p) => p.id))); }
  };

  const bulkActivate = async () => {
    setBulkLoading(true);
    await supabase.from("products").update({ is_active: true }).in("id", [...selected]);
    notifications.show({ title: "Activated", message: `${selected.size} products set to active`, color: "green", icon: <IconCircleCheck size={16} /> });
    setBulkLoading(false);
    fetchProducts();
  };

  const bulkDeactivate = async () => {
    setBulkLoading(true);
    await supabase.from("products").update({ is_active: false }).in("id", [...selected]);
    notifications.show({ title: "Deactivated", message: `${selected.size} products hidden`, color: "gray" });
    setBulkLoading(false);
    fetchProducts();
  };

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} product(s)? This cannot be undone.`)) return;
    setBulkLoading(true);
    await supabase.from("products").delete().in("id", [...selected]);
    notifications.show({ title: "Deleted", message: `${selected.size} products removed`, color: "red" });
    setBulkLoading(false);
    fetchProducts();
  };

  const allChecked = products.length > 0 && selected.size === products.length;
  const someChecked = selected.size > 0 && selected.size < products.length;

  return (
    <Box p={{ base: "md", md: "xl" }}>
      {/* Header */}
      <Group justify="space-between" mb="xl" pb="md" style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}>
        <Box>
          <Text fz="xs" tt="uppercase" c="dimmed" style={{ letterSpacing: 1.5 }}>Admin</Text>
          <Title order={2} fw={800} fz="xl" mt={4}>
            Products
            {products.length > 0 && (
              <Text span fz="sm" fw={400} c="dimmed" ml={8}>({products.length})</Text>
            )}
          </Title>
        </Box>
        <Button component={Link} href="/admin/products/new" color="orange" radius="sm" leftSection={<IconPlus size={16} />}>
          Add Product
        </Button>
      </Group>

      {/* Search + Filter row */}
      <Group mb="lg" gap="sm">
        <TextInput
          placeholder="Search products..."
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          radius="sm"
          style={{ flex: 1, maxWidth: 360 }}
        />
        <Select
          value={filter}
          onChange={(v) => setFilter(v ?? "all")}
          data={[
            { value: "all", label: "All products" },
            { value: "active", label: "Active only" },
            { value: "inactive", label: "Inactive / Draft" },
            { value: "featured", label: "Featured" },
            { value: "flash", label: "Flash Sale" },
          ]}
          w={180}
          radius="sm"
        />
      </Group>

      {/* Product list */}
      {loading ? (
        <Box style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} height={72} radius="md" />)}
        </Box>
      ) : products.length === 0 ? (
        <Box ta="center" py={60}>
          <IconPackageOff size={40} style={{ color: "var(--mantine-color-gray-4)", marginBottom: 12 }} />
          <Text c="dimmed" mb="md">No products found.</Text>
          <Button component={Link} href="/admin/products/new" color="orange" radius="sm" mt="md" size="sm">
            Add your first product
          </Button>
        </Box>
      ) : (
        <Box style={{ border: "1px solid var(--mantine-color-gray-2)", borderRadius: 8, overflow: "hidden", backgroundColor: "white" }}>
          {/* Table header with "select all" checkbox */}
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 16px",
              backgroundColor: "var(--mantine-color-gray-0)",
              borderBottom: "1px solid var(--mantine-color-gray-2)",
            }}
          >
            <Checkbox
              checked={allChecked}
              indeterminate={someChecked}
              onChange={selectAll}
              size="sm"
              color="orange"
            />
            <Text fz="xs" fw={600} c="dimmed" tt="uppercase" style={{ flex: 1 }}>Product</Text>
            <Text fz="xs" fw={600} c="dimmed" tt="uppercase" style={{ width: 90 }} visibleFrom="sm">Price</Text>
            <Text fz="xs" fw={600} c="dimmed" tt="uppercase" style={{ width: 80 }} visibleFrom="md">Status</Text>
            <Box style={{ width: 36 }} />
          </Box>

          {products.map((product, i) => (
            <Box
              key={product.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 16px",
                borderBottom: i < products.length - 1 ? "1px solid var(--mantine-color-gray-1)" : undefined,
                backgroundColor: selected.has(product.id) ? "var(--mantine-color-orange-0)" : "white",
                transition: "background 120ms",
              }}
            >
              <Checkbox
                checked={selected.has(product.id)}
                onChange={() => toggleSelect(product.id)}
                size="sm"
                color="orange"
              />

              {/* Thumbnail */}
              <Box style={{ width: 44, height: 44, borderRadius: 6, overflow: "hidden", backgroundColor: "var(--mantine-color-gray-1)", flexShrink: 0, position: "relative" }}>
                {product.images?.[0] ? (
                  <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: "cover" }} />
                ) : (
                  <Box style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                    <IconPackageOff size={18} style={{ color: "var(--mantine-color-gray-4)" }} />
                  </Box>
                )}
              </Box>

              {/* Info */}
              <Box style={{ flex: 1, minWidth: 0 }}>
                <Text fz="sm" fw={600} lineClamp={1}>{product.name}</Text>
                <Group gap="xs" mt={2}>
                  {product.brand && <Text fz="xs" c="dimmed">{product.brand}</Text>}
                  {product.is_flash_sale && <Badge size="xs" radius="sm" color="orange" variant="light">Flash Sale</Badge>}
                  {product.is_featured && <Badge size="xs" radius="sm" color="blue" variant="light">Featured</Badge>}
                </Group>
              </Box>

              {/* Price */}
              <Text fz="sm" fw={700} c="orange.6" style={{ width: 90, flexShrink: 0 }} visibleFrom="sm">
                {product.price.toLocaleString("fr-SN")} CFA
              </Text>

              {/* Status badge */}
              <Box style={{ width: 80, flexShrink: 0 }} visibleFrom="md">
                <Badge size="sm" radius="sm" variant="light" color={product.is_active ? "green" : "gray"}>
                  {product.is_active ? "Active" : "Draft"}
                </Badge>
              </Box>

              {/* Row menu */}
              <Menu shadow="md" width={170} position="bottom-end">
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray" size="sm">
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item component={Link} href={`/product/${product.slug}`} target="_blank" leftSection={<IconEye size={14} />}>
                    View on site
                  </Menu.Item>
                  <Menu.Item component={Link} href={`/admin/products/${product.id}/edit`} leftSection={<IconEdit size={14} />}>
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => toggleActive(product.id, product.is_active)}
                    leftSection={product.is_active ? <IconEyeOff size={14} /> : <IconEye size={14} />}
                  >
                    {product.is_active ? "Deactivate" : "Activate"}
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item color="red" onClick={() => handleDelete(product.id, product.name)} leftSection={<IconTrash size={14} />}>
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Box>
          ))}
        </Box>
      )}

      {/* Floating bulk action bar */}
      <Transition mounted={selected.size > 0} transition="slide-up" duration={200}>
        {(styles) => (
          <Paper
            shadow="xl"
            radius="lg"
            style={{
              ...styles,
              position: "fixed",
              bottom: 28,
              left: "50%",
              transform: "translateX(-50%)",
              padding: "12px 20px",
              backgroundColor: "var(--mantine-color-dark-8)",
              zIndex: 200,
              minWidth: 380,
            }}
          >
            <Group gap="md" align="center">
              <Text fz="sm" fw={600} c="white">
                {selected.size} selected
              </Text>
              <Button
                size="xs"
                radius="sm"
                color="green"
                variant="light"
                loading={bulkLoading}
                leftSection={<IconCircleCheck size={14} />}
                onClick={bulkActivate}
              >
                Activate
              </Button>
              <Button
                size="xs"
                radius="sm"
                color="gray"
                variant="light"
                loading={bulkLoading}
                leftSection={<IconEyeOff size={14} />}
                onClick={bulkDeactivate}
              >
                Deactivate
              </Button>
              <Button
                size="xs"
                radius="sm"
                color="red"
                variant="light"
                loading={bulkLoading}
                leftSection={<IconTrash size={14} />}
                onClick={bulkDelete}
              >
                Delete
              </Button>
              <ActionIcon
                size="sm"
                variant="subtle"
                color="gray"
                onClick={() => setSelected(new Set())}
                title="Clear selection"
              >
                ✕
              </ActionIcon>
            </Group>
          </Paper>
        )}
      </Transition>
    </Box>
  );
}
