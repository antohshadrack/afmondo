"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Box, Title, Text, TextInput, Textarea, NumberInput, Switch,
  Button, Group, Select, MultiSelect, Stack, Loader, Center, Alert, Grid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft, IconCheck, IconAlertCircle, IconUpload, IconTrash } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import { uploadMultipleToCloudinary } from "@/lib/cloudinary";
import { getProductCategoryIds, setProductCategories } from "@/lib/supabase/queries";
import type { DbCategory, DbProduct } from "@/lib/supabase/queries";
import ProductCard from "@/app/components/shared/ProductCard";
import type { Product } from "@/app/components/shared/ProductCard";

interface ProductFormValues {
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number | "";
  brand: string;
  category_ids: string[];   // ← multi-category
  is_active: boolean;
  is_featured: boolean;
  is_flash_sale: boolean;
  flash_sale_ends: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const supabase = createClient();

  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(false);

  const form = useForm<ProductFormValues>({
    initialValues: {
      name: "", slug: "", description: "", price: 0,
      original_price: "", brand: "", category_ids: [],
      is_active: true, is_featured: false, is_flash_sale: false,
      flash_sale_ends: "",
    },
    validate: {
      name: (v) => v.trim().length < 2 ? "Name is required" : null,
      slug: (v) => v.trim().length < 2 ? "Slug is required" : null,
      price: (v) => v <= 0 ? "Price must be greater than 0" : null,
    },
  });

  // Fetch product & categories
  useEffect(() => {
    async function load() {
      setFetchLoading(true);
      const [{ data: product, error }, { data: cats }, existingCategoryIds] = await Promise.all([
        supabase.from("products").select("*").eq("id", productId).single(),
        supabase.from("categories").select("*").order("sort_order"),
        getProductCategoryIds(productId),
      ]);

      if (error || !product) {
        setFetchError(error?.message ?? "Product not found");
        setFetchLoading(false);
        return;
      }

      const p = product as DbProduct;
      setCategories(cats ?? []);
      setExistingImages(p.images ?? []);

      form.setValues({
        name: p.name,
        slug: p.slug,
        description: p.description ?? "",
        price: p.price,
        original_price: p.original_price ?? "",
        brand: p.brand ?? "",
        category_ids: existingCategoryIds,
        is_active: p.is_active,
        is_featured: p.is_featured,
        is_flash_sale: p.is_flash_sale,
        flash_sale_ends: p.flash_sale_ends
          ? new Date(p.flash_sale_ends).toISOString().slice(0, 16)
          : "",
      });
      setFetchLoading(false);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 5 - existingImages.length);
    setNewImageFiles(files);
    setNewImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((u) => u !== url));
  };

  const uploadNewImages = async (): Promise<string[]> => {
    return uploadMultipleToCloudinary(newImageFiles);
  };

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    try {
      // Upload any new images
      let allImages = [...existingImages];
      if (newImageFiles.length > 0) {
        setUploadProgress(true);
        const uploaded = await uploadNewImages();
        allImages = [...allImages, ...uploaded];
        setUploadProgress(false);
      }

      const { error } = await supabase.from("products").update({
        name: values.name,
        slug: values.slug,
        description: values.description || null,
        price: values.price,
        original_price: values.original_price || null,
        brand: values.brand || null,
        is_active: values.is_active,
        is_featured: values.is_featured,
        is_flash_sale: values.is_flash_sale,
        flash_sale_ends: values.flash_sale_ends
          ? new Date(values.flash_sale_ends).toISOString()
          : null,
        images: allImages,
      }).eq("id", productId);

      if (error) throw new Error(error.message);

      // Save categories to junction table (replace strategy)
      await setProductCategories(productId, values.category_ids);

      notifications.show({
        title: "Product updated!",
        message: values.name,
        color: "green",
        icon: <IconCheck size={16} />,
      });
      router.push("/admin/products");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      notifications.show({ title: "Error", message: msg, color: "red" });
      setLoading(false);
    }
  });

  if (fetchLoading) {
    return (
      <Center style={{ minHeight: 400 }}>
        <Loader color="orange" />
      </Center>
    );
  }

  if (fetchError) {
    return (
      <Box p="xl">
        <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error loading product">
          {fetchError}
        </Alert>
        <Button component={Link} href="/admin/products" mt="md" variant="subtle" color="gray" leftSection={<IconArrowLeft size={14} />}>
          Back to Products
        </Button>
      </Box>
    );
  }

  const liveProduct: Product = {
    id: productId,
    name: form.values.name || "Example Product Name",
    slug: form.values.slug || "example-product",
    price: Number(form.values.price) || 0,
    originalPrice: form.values.original_price ? Number(form.values.original_price) : undefined,
    discount: form.values.original_price && Number(form.values.original_price) > Number(form.values.price)
      ? Math.round(((Number(form.values.original_price) - Number(form.values.price)) / Number(form.values.original_price)) * 100)
      : undefined,
    image: existingImages.length > 0 ? existingImages[0] : (newImagePreviews.length > 0 ? newImagePreviews[0] : "https://placehold.co/400x400?text=No+Image"),
    images: [...existingImages, ...newImagePreviews],
    brand: form.values.brand,
    flash_sale_ends: form.values.is_flash_sale && form.values.flash_sale_ends ? new Date(form.values.flash_sale_ends).toISOString() + "Z" : undefined,
    description: form.values.description,
  };

  return (
    <Box p={{ base: "md", md: "xl" }} maw={1200} mx="auto">
      <Group mb="xl" pb="md" style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}>
        <Button component={Link} href="/admin/products" variant="subtle" size="xs" color="gray" leftSection={<IconArrowLeft size={14} />}>
          Products
        </Button>
        <Title order={2} fw={800} fz="xl">Edit Product</Title>
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
            <Text fz="xs" c="dimmed" mt="xs">
              Discount % is calculated automatically from price vs original price.
            </Text>
          </Box>

          {/* Images */}
          <Box style={{ border: "1px solid var(--mantine-color-gray-2)", borderRadius: 8, backgroundColor: "white" }} p="lg">
            <Text fw={700} fz="sm" mb="xs">Images</Text>
            <Text fz="xs" c="dimmed" mb="md">
              Current images shown below. Remove any, then upload new ones (up to 5 total).
            </Text>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <Group gap="xs" mb="md">
                {existingImages.map((url, i) => (
                  <Box
                    key={i}
                    style={{ position: "relative", width: 80, height: 80, borderRadius: 8, overflow: "hidden", border: "1px solid var(--mantine-color-gray-3)" }}
                  >
                    <Image src={url} alt={`Image ${i + 1}`} fill style={{ objectFit: "cover" }} />
                    <Box
                      onClick={() => removeExistingImage(url)}
                      style={{
                        position: "absolute", top: 2, right: 2,
                        background: "rgba(0,0,0,0.6)", borderRadius: 4,
                        padding: 2, cursor: "pointer", display: "flex",
                      }}
                    >
                      <IconTrash size={12} color="white" />
                    </Box>
                    {i === 0 && (
                      <Box style={{ position: "absolute", bottom: 2, left: 2, background: "var(--mantine-color-orange-5)", borderRadius: 3, padding: "1px 4px" }}>
                        <Text fz={9} c="white" fw={700}>Main</Text>
                      </Box>
                    )}
                  </Box>
                ))}
              </Group>
            )}

            {/* New image upload */}
            {existingImages.length < 5 && (
              <label style={{ cursor: "pointer" }}>
                <Box
                  style={{
                    border: "2px dashed var(--mantine-color-gray-3)",
                    borderRadius: 8, padding: "20px",
                    textAlign: "center", backgroundColor: "var(--mantine-color-gray-0)",
                  }}
                >
                  <IconUpload size={22} style={{ color: "var(--mantine-color-gray-5)", marginBottom: 6 }} />
                  <Text fz="sm" c="dimmed">
                    {newImageFiles.length > 0
                      ? `${newImageFiles.length} new file(s) selected`
                      : "Click to add more images"}
                  </Text>
                </Box>
                <input type="file" accept="image/*" multiple onChange={handleNewImages} style={{ display: "none" }} />
              </label>
            )}

            {newImagePreviews.length > 0 && (
              <Group mt="sm" gap="xs">
                {newImagePreviews.map((url, i) => (
                  <Box key={i} style={{ width: 64, height: 64, borderRadius: 6, overflow: "hidden", position: "relative", border: "2px solid var(--mantine-color-orange-4)" }}>
                    <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </Box>
                ))}
              </Group>
            )}
          </Box>

          {/* Visibility */}
          <Box style={{ border: "1px solid var(--mantine-color-gray-2)", borderRadius: 8, backgroundColor: "white" }} p="lg">
            <Text fw={700} fz="sm" mb="md">Visibility</Text>
            <Stack gap="md">
              <Switch label="Active (visible on storefront)" color="orange" {...form.getInputProps("is_active", { type: "checkbox" })} />
              <Switch label="Featured (show in featured section)" color="orange" {...form.getInputProps("is_featured", { type: "checkbox" })} />
              <Switch label="Flash Sale" color="orange" {...form.getInputProps("is_flash_sale", { type: "checkbox" })} />
              {form.values.is_flash_sale && (
                <TextInput
                  type="datetime-local"
                  label="Flash Sale Ends"
                  description="Leave blank to use a rolling 24h window"
                  {...form.getInputProps("flash_sale_ends")}
                />
              )}
            </Stack>
          </Box>

          <Group justify="flex-end">
            <Button component={Link} href="/admin/products" variant="default" radius="sm">Cancel</Button>
            <Button type="submit" color="orange" radius="sm" loading={loading || uploadProgress}>
              {uploadProgress ? "Uploading images..." : "Save Changes"}
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
