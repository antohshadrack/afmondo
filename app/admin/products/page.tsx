"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Box, Title, Text, Button, Group, Badge, TextInput,
  ActionIcon, Skeleton, SimpleGrid, Menu,
} from "@mantine/core";
import { IconPlus, IconSearch, IconDots, IconEdit, IconTrash, IconEye } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import type { DbProduct } from "@/lib/supabase/queries";
import { notifications } from "@mantine/notifications";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const supabase = createClient();

  const fetchProducts = async () => {
    setLoading(true);
    let q = supabase.from("products").select("*").order("created_at", { ascending: false });
    if (search) q = q.ilike("name", `%${search}%`);
    const { data } = await q;
    setProducts(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      notifications.show({ title: "Error", message: error.message, color: "red" });
    } else {
      notifications.show({ title: "Deleted", message: `"${name}" removed`, color: "green" });
      fetchProducts();
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("products").update({ is_active: !current }).eq("id", id);
    fetchProducts();
  };

  return (
    <Box p={{ base: "md", md: "xl" }}>
      {/* Header */}
      <Group justify="space-between" mb="xl" pb="md" style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}>
        <Box>
          <Text fz="xs" tt="uppercase" c="dimmed" style={{ letterSpacing: 1.5 }}>Admin</Text>
          <Title order={2} fw={800} fz="xl" mt={4}>Products</Title>
        </Box>
        <Button component={Link} href="/admin/products/new" color="orange" radius="sm" leftSection={<IconPlus size={16} />}>
          Add Product
        </Button>
      </Group>

      {/* Search */}
      <TextInput
        placeholder="Search products..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        radius="sm"
        mb="lg"
        maw={400}
      />

      {/* Product list */}
      {loading ? (
        <SimpleGrid cols={{ base: 1 }} spacing="sm">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} height={72} radius="md" />)}
        </SimpleGrid>
      ) : products.length === 0 ? (
        <Box ta="center" py={60}>
          <Text c="dimmed">No products found.</Text>
          <Button component={Link} href="/admin/products/new" color="orange" radius="sm" mt="md" size="sm">
            Add your first product
          </Button>
        </Box>
      ) : (
        <Box style={{ border: "1px solid var(--mantine-color-gray-2)", borderRadius: 8, overflow: "hidden", backgroundColor: "white" }}>
          {products.map((product, i) => (
            <Box
              key={product.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "12px 16px",
                borderBottom: i < products.length - 1 ? "1px solid var(--mantine-color-gray-1)" : undefined,
              }}
            >
              {/* Thumbnail */}
              <Box style={{ width: 48, height: 48, borderRadius: 6, overflow: "hidden", backgroundColor: "var(--mantine-color-gray-1)", flexShrink: 0, position: "relative" }}>
                {product.images?.[0] && (
                  <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: "cover" }} />
                )}
              </Box>

              {/* Info */}
              <Box style={{ flex: 1, minWidth: 0 }}>
                <Text fz="sm" fw={600} lineClamp={1}>{product.name}</Text>
                <Group gap="xs" mt={2}>
                  <Text fz="xs" c="orange.6" fw={700}>{product.price.toLocaleString("fr-SN")} CFA</Text>
                  {product.brand && <Text fz="xs" c="dimmed">· {product.brand}</Text>}
                </Group>
              </Box>

              {/* Badges */}
              <Group gap="xs" visibleFrom="sm">
                <Badge size="xs" radius="sm" variant="light" color={product.is_active ? "green" : "gray"}>
                  {product.is_active ? "Active" : "Inactive"}
                </Badge>
                {product.is_flash_sale && <Badge size="xs" radius="sm" color="orange">Flash</Badge>}
              </Group>

              {/* Actions */}
              <Menu shadow="md" width={160} position="bottom-end">
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray" size="sm"><IconDots size={16} /></ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item component={Link} href={`/product/${product.slug}`} target="_blank" leftSection={<IconEye size={14} />}>View</Menu.Item>
                  <Menu.Item component={Link} href={`/admin/products/${product.id}/edit`} leftSection={<IconEdit size={14} />}>Edit</Menu.Item>
                  <Menu.Item onClick={() => toggleActive(product.id, product.is_active)} leftSection={<IconEye size={14} />}>
                    {product.is_active ? "Deactivate" : "Activate"}
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item color="red" onClick={() => handleDelete(product.id, product.name)} leftSection={<IconTrash size={14} />}>Delete</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
