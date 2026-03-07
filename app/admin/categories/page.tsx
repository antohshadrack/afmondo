"use client";

import { useEffect, useState } from "react";
import {
  Box, Title, Text, Button, Group, TextInput, ActionIcon,
  Badge, Skeleton, Modal, Stack, NumberInput, Select, Menu,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconPlus, IconSearch, IconEdit, IconTrash, IconGripVertical,
  IconCheck, IconCategory, IconDots,
} from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import type { DbCategory } from "@/lib/supabase/queries";

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").trim();
}

interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  parent_id: string;
  sort_order: number;
}

export default function AdminCategoriesPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DbCategory | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<CategoryFormValues>({
    initialValues: { name: "", slug: "", description: "", parent_id: "", sort_order: 0 },
    validate: {
      name: (v) => v.trim().length < 1 ? "Name is required" : null,
      slug: (v) => v.trim().length < 1 ? "Slug is required" : null,
    },
  });

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    setCategories(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditing(null);
    form.reset();
    setModalOpen(true);
  };

  const openEdit = (cat: DbCategory) => {
    setEditing(cat);
    form.setValues({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? "",
      parent_id: cat.parent_id ?? "",
      sort_order: cat.sort_order,
    });
    setModalOpen(true);
  };

  const handleSave = form.onSubmit(async (values) => {
    setSaving(true);
    const payload = {
      name: values.name,
      slug: values.slug,
      description: values.description || null,
      parent_id: values.parent_id || null,
      sort_order: values.sort_order,
    };
    const { error } = editing
      ? await supabase.from("categories").update(payload).eq("id", editing.id)
      : await supabase.from("categories").insert(payload);

    if (error) {
      notifications.show({ title: "Error", message: error.message, color: "red" });
    } else {
      notifications.show({
        title: editing ? "Category updated" : "Category created",
        message: values.name,
        color: "green",
        icon: <IconCheck size={16} />,
      });
      setModalOpen(false);
      fetchCategories();
    }
    setSaving(false);
  });

  const handleDelete = async (cat: DbCategory) => {
    if (!confirm(`Delete "${cat.name}"? Products in this category will be unassigned.`)) return;
    const { error } = await supabase.from("categories").delete().eq("id", cat.id);
    if (error) {
      notifications.show({ title: "Error", message: error.message, color: "red" });
    } else {
      notifications.show({ title: "Deleted", message: cat.name, color: "gray" });
      fetchCategories();
    }
  };

  // Build parent options (only top-level cats as parents)
  const parentOptions = categories
    .filter((c) => !c.parent_id && editing?.id !== c.id)
    .map((c) => ({ value: c.id, label: c.name }));

  return (
    <Box p={{ base: "md", md: "xl" }}>
      {/* Header */}
      <Group justify="space-between" mb="xl" pb="md" style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}>
        <Box>
          <Text fz="xs" tt="uppercase" c="dimmed" style={{ letterSpacing: 1.5 }}>Admin</Text>
          <Title order={2} fw={800} fz="xl" mt={4}>Categories</Title>
        </Box>
        <Button color="orange" radius="sm" leftSection={<IconPlus size={16} />} onClick={openNew}>
          Add Category
        </Button>
      </Group>

      {/* Search */}
      <TextInput
        placeholder="Search categories..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        radius="sm"
        mb="lg"
        maw={400}
      />

      {/* Category list */}
      {loading ? (
        <Stack gap="xs">
          {Array(5).fill(0).map((_, i) => <Skeleton key={i} height={60} radius="md" />)}
        </Stack>
      ) : filtered.length === 0 ? (
        <Box ta="center" py={60}>
          <IconCategory size={40} style={{ color: "var(--mantine-color-gray-4)", marginBottom: 12 }} />
          <Text c="dimmed" mb="md">
            {search ? "No categories match your search." : "No categories yet."}
          </Text>
          {!search && (
            <Button color="orange" radius="sm" size="sm" onClick={openNew}>
              Create your first category
            </Button>
          )}
        </Box>
      ) : (
        <Box style={{ border: "1px solid var(--mantine-color-gray-2)", borderRadius: 8, overflow: "hidden", backgroundColor: "white" }}>
          {/* Table header */}
          <Box style={{ display: "grid", gridTemplateColumns: "1fr 160px 80px 60px", gap: 16, padding: "8px 16px", backgroundColor: "var(--mantine-color-gray-0)", borderBottom: "1px solid var(--mantine-color-gray-2)" }}>
            <Text fz="xs" fw={600} c="dimmed" tt="uppercase">Name / Slug</Text>
            <Text fz="xs" fw={600} c="dimmed" tt="uppercase">Parent</Text>
            <Text fz="xs" fw={600} c="dimmed" tt="uppercase" ta="center">Order</Text>
            <Box />
          </Box>

          {filtered.map((cat, i) => {
            const parent = categories.find((c) => c.id === cat.parent_id);
            return (
              <Box
                key={cat.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 160px 80px 60px",
                  gap: 16,
                  padding: "12px 16px",
                  alignItems: "center",
                  borderBottom: i < filtered.length - 1 ? "1px solid var(--mantine-color-gray-1)" : undefined,
                }}
              >
                <Box>
                  <Group gap={6} align="center">
                    <IconGripVertical size={14} style={{ color: "var(--mantine-color-gray-4)", cursor: "grab" }} />
                    <Text fz="sm" fw={600}>{cat.name}</Text>
                    {cat.parent_id && (
                      <Badge size="xs" variant="light" color="gray">sub</Badge>
                    )}
                  </Group>
                  <Text fz="xs" c="dimmed" ml={22}>/category/{cat.slug}</Text>
                </Box>

                <Text fz="sm" c={parent ? "dark" : "dimmed"}>
                  {parent?.name ?? "—"}
                </Text>

                <Text fz="sm" ta="center" c="dimmed">{cat.sort_order}</Text>

                <Menu shadow="md" width={160} position="bottom-end">
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="gray" size="sm">
                      <IconDots size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => openEdit(cat)}>
                      Edit
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={() => handleDelete(cat)}>
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Add / Edit Modal */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={<Text fw={700}>{editing ? "Edit Category" : "New Category"}</Text>}
        radius="md"
        size="md"
      >
        <form onSubmit={handleSave}>
          <Stack gap="md">
            <TextInput
              label="Category Name"
              placeholder="e.g. Electronics"
              required
              {...form.getInputProps("name")}
              onChange={(e) => {
                form.setFieldValue("name", e.currentTarget.value);
                if (!editing) form.setFieldValue("slug", slugify(e.currentTarget.value));
              }}
            />
            <TextInput
              label="Slug (URL)"
              placeholder="electronics"
              description="Used in URLs like /electronics. Auto-generated from name."
              required
              {...form.getInputProps("slug")}
            />
            <TextInput
              label="Description"
              placeholder="Short description (optional)"
              {...form.getInputProps("description")}
            />
            <Select
              label="Parent Category"
              placeholder="None (top-level)"
              data={parentOptions}
              clearable
              {...form.getInputProps("parent_id")}
            />
            <NumberInput
              label="Sort Order"
              description="Lower numbers appear first"
              min={0}
              {...form.getInputProps("sort_order")}
            />
            <Group justify="flex-end" mt="xs">
              <Button variant="default" radius="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" color="orange" radius="sm" loading={saving}>
                {editing ? "Save Changes" : "Create Category"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
}
