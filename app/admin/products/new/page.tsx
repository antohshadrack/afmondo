"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box, Title, Text, TextInput, Textarea, NumberInput, Switch,
  Button, Group, Select, MultiSelect, Stack, Divider, Alert, Grid
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft, IconCheck, IconAlertCircle, IconUpload } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import { uploadMultipleToCloudinary } from "@/lib/cloudinary";
import { setProductCategories } from "@/lib/supabase/queries";
import type { DbCategory } from "@/lib/supabase/queries";
import ProductCard from "@/app/components/shared/ProductCard";
import type { Product } from "@/app/components/shared/ProductCard";

interface ProductFormValues {
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number | "";
  brand: string;
  category_ids: string[];
  is_active: boolean;
  is_featured: boolean;
  is_flash_sale: boolean;
  initial_stock: number;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").trim();
}

export default function NewProductPage() {
  const router = useRouter();
  const supabase = createClient();
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(false);

  useEffect(() => {
    supabase.from("categories").select("*").order("sort_order").then(({ data }) => setCategories(data ?? []));
  }, []);

  const form = useForm<ProductFormValues>({
    initialValues: {
      name: "", slug: "", description: "", price: 0,
      original_price: "", brand: "", category_ids: [],
      is_active: true, is_featured: false, is_flash_sale: false,
      initial_stock: 0,
    },
    validate: {
      name: (v) => v.trim().length < 2 ? "Name is required" : null,
      slug: (v) => v.trim().length < 2 ? "Slug is required" : null,
      price: (v) => v <= 0 ? "Price must be greater than 0" : null,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 5);
    setImageFiles(files);
    setImageUrls(files.map((f) => URL.createObjectURL(f)));
  };

  const uploadImages = async (): Promise<string[]> => {
    return uploadMultipleToCloudinary(imageFiles);
  };

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    try {
      // 1. Insert product
      const { data: product, error: insertError } = await supabase.from("products").insert({
        name: values.name,
        slug: values.slug,
        description: values.description || null,
        price: values.price,
        original_price: values.original_price || null,
        brand: values.brand || null,
        is_active: values.is_active,
        is_featured: values.is_featured,
        is_flash_sale: values.is_flash_sale,
        images: [],
      }).select().single();

      if (insertError || !product) throw new Error(insertError?.message ?? "Insert failed");

      // 2. Link categories via junction table
      if (values.category_ids.length > 0) {
        await setProductCategories(product.id, values.category_ids);
      }

      // 3. Upload images
      let images: string[] = [];
      if (imageFiles.length > 0) {
        setUploadProgress(true);
        images = await uploadImages();
        await supabase.from("products").update({ images }).eq("id", product.id);
        setUploadProgress(false);
      }

      // 4. Init inventory
      if (values.initial_stock > 0) {
        await supabase.from("inventory").insert({ product_id: product.id, quantity: values.initial_stock });
      }

      notifications.show({ title: "Product created!", message: values.name, color: "green", icon: <IconCheck size={16} /> });
      router.push("/admin/products");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      notifications.show({ title: "Error", message: msg, color: "red" });
      setLoading(false);
    }
  });

  const liveProduct: Product = {
    id: "preview",
    name: form.values.name || "Example Product Name",
    slug: form.values.slug || "example-product",
    price: Number(form.values.price) || 0,
    originalPrice: form.values.original_price ? Number(form.values.original_price) : undefined,
    discount: form.values.original_price && Number(form.values.original_price) > Number(form.values.price)
      ? Math.round(((Number(form.values.original_price) - Number(form.values.price)) / Number(form.values.original_price)) * 100)
      : undefined,
    image: imageUrls.length > 0 ? imageUrls[0] : "https://placehold.co/400x400?text=No+Image",
    images: imageUrls,
    brand: form.values.brand,
    flash_sale_ends: form.values.is_flash_sale ? new Date(Date.now() + 86400000).toISOString() : undefined,
    description: form.values.description,
    itemsLeft: form.values.initial_stock,
  };

  return (
    <Box p={{ base: "md", md: "xl" }} maw={1200} mx="auto">
      <Group mb="xl" pb="md" style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}>
        <Button component={Link} href="/admin/products" variant="subtle" size="xs" color="gray" leftSection={<IconArrowLeft size={14} />}>
          Products
        </Button>
        <Title order={2} fw={800} fz="xl">New Product</Title>
      </Group>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 7 }}>
          <form onSubmit={handleSubmit}>
            <Stack gap="lg">
              {/* Basic info */}
              <Box style={{ border: "1px solid var(--mantine-color-gray-2)", borderRadius: 8, backgroundColor: "white" }} p="lg">
                <Text fw={700} fz="sm" mb="md">Basic Information</Text>
                <Stack gap="md">
                  <TextInput
                    label="Product Name" required placeholder={'e.g. Samsung 55" QLED TV'}
                    {...form.getInputProps("name")}
                    onChange={(e) => {
                      form.setFieldValue("name", e.currentTarget.value);
                      form.setFieldValue("slug", slugify(e.currentTarget.value));
                    }}
                  />
                  <TextInput
                    label="Slug (URL)" required placeholder="samsung-55-qled-tv"
                    description="Auto-generated from name, you can edit it"
                    {...form.getInputProps("slug")}
                  />
                  <Textarea label="Description" placeholder="Product details..." rows={4} {...form.getInputProps("description")} />
                  <TextInput label="Brand" placeholder="e.g. Samsung, Toyota, IKEA" {...form.getInputProps("brand")} />
                  <MultiSelect
                    label="Categories"
                    placeholder="Select one or more categories"
                    data={categories.map((c) => ({ value: c.id, label: c.name }))}
                    searchable
                    {...form.getInputProps("category_ids")}
                  />
                </Stack>
              </Box>

              {/* Pricing */}
              <Box style={{ border: "1px solid var(--mantine-color-gray-2)", borderRadius: 8, backgroundColor: "white" }} p="lg">
                <Text fw={700} fz="sm" mb="md">Pricing</Text>
                <Group grow>
                  <NumberInput label="Price (CFA)" required min={0} thousandSeparator=" " {...form.getInputProps("price")} />
                  <NumberInput label="Original Price (CFA)" placeholder="Leave empty if no discount" min={0} thousandSeparator=" " {...form.getInputProps("original_price")} />
                </Group>
              </Box>

              {/* Images */}
              <Box style={{ border: "1px solid var(--mantine-color-gray-2)", borderRadius: 8, backgroundColor: "white" }} p="lg">
                <Text fw={700} fz="sm" mb="xs">Images</Text>
                <Text fz="xs" c="dimmed" mb="md">Upload up to 5 images (JPG, PNG, WEBP). First image is the main image.</Text>
                <label style={{ cursor: "pointer" }}>
                  <Box style={{ border: "2px dashed var(--mantine-color-gray-3)", borderRadius: 8, padding: "24px", textAlign: "center", backgroundColor: "var(--mantine-color-gray-0)" }}>
                    <IconUpload size={24} style={{ color: "var(--mantine-color-gray-5)", marginBottom: 8 }} />
                    <Text fz="sm" c="dimmed">{imageFiles.length > 0 ? `${imageFiles.length} file(s) selected` : "Click to select images"}</Text>
                  </Box>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: "none" }} />
                </label>
                {imageUrls.length > 0 && (
                  <Group mt="sm" gap="xs">
                    {imageUrls.map((url, i) => (
                      <Box key={i} style={{ width: 64, height: 64, borderRadius: 6, overflow: "hidden", position: "relative", border: "1px solid var(--mantine-color-gray-2)" }}>
                        <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </Box>
                    ))}
                  </Group>
                )}
              </Box>

              {/* Inventory */}
              <Box style={{ border: "1px solid var(--mantine-color-gray-2)", borderRadius: 8, backgroundColor: "white" }} p="lg">
                <Text fw={700} fz="sm" mb="md">Inventory</Text>
                <NumberInput label="Initial Stock" min={0} placeholder="0" {...form.getInputProps("initial_stock")} />
              </Box>

              {/* Visibility */}
              <Box style={{ border: "1px solid var(--mantine-color-gray-2)", borderRadius: 8, backgroundColor: "white" }} p="lg">
                <Text fw={700} fz="sm" mb="md">Visibility</Text>
                <Stack gap="md">
                  <Switch label="Active (visible on storefront)" color="orange" {...form.getInputProps("is_active", { type: "checkbox" })} />
                  <Switch label="Featured (show in featured section)" color="orange" {...form.getInputProps("is_featured", { type: "checkbox" })} />
                  <Switch label="Flash Sale" color="orange" {...form.getInputProps("is_flash_sale", { type: "checkbox" })} />
                </Stack>
              </Box>

              <Group justify="flex-end">
                <Button component={Link} href="/admin/products" variant="default" radius="sm">Cancel</Button>
                <Button type="submit" color="orange" radius="sm" loading={loading || uploadProgress}>
                  {uploadProgress ? "Uploading images..." : "Create Product"}
                </Button>
              </Group>
            </Stack>
          </form>
        </Grid.Col>

        {/* Live Preview right column */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Box style={{ position: "sticky", top: 100 }}>
            <Text fw={700} fz="sm" mb="md" c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }}>Live Storefront Preview</Text>
            <ProductCard
              product={liveProduct}
              variant={form.values.is_flash_sale ? "flash-sale" : "grid"}
              size="full"
              showActionButtons
              showBrand
              showProgressBar={form.values.is_flash_sale}
              showItemsLeft={form.values.is_flash_sale}
            />
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
}
