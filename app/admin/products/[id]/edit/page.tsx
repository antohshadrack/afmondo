"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Box, Title, Text, TextInput, Textarea, NumberInput, Switch,
  Button, Group, Select, Stack, Center, Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft, IconCheck, IconUpload, IconTrash } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import { getProduct, type DbCategory } from "@/lib/supabase/queries";

interface ProductFormValues {
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number | "";
  brand: string;
  category_id: string;
  is_active: boolean;
  is_featured: boolean;
  is_flash_sale: boolean;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").trim();
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(false);

  const form = useForm<ProductFormValues>({
    initialValues: {
      name: "", slug: "", description: "", price: 0,
      original_price: "", brand: "", category_id: "",
      is_active: true, is_featured: false, is_flash_sale: false,
    },
    validate: {
      name: (v) => v.trim().length < 2 ? "Name is required" : null,
      slug: (v) => v.trim().length < 2 ? "Slug is required" : null,
      price: (v) => v <= 0 ? "Price must be greater than 0" : null,
    },
  });

  useEffect(() => {
    async function init() {
      try {
        const { data: cats } = await supabase.from("categories").select("*").order("sort_order");
        setCategories(cats ?? []);

        if (params.id) {
          const product = await getProduct(params.id as string);
          if (product) {
            form.setValues({
              name: product.name,
              slug: product.slug,
              description: product.description || "",
              price: product.price,
              original_price: product.original_price || "",
              brand: product.brand || "",
              category_id: product.category_id || "",
              is_active: product.is_active,
              is_featured: product.is_featured,
              is_flash_sale: product.is_flash_sale,
            });
            setExistingImages(product.images || []);
          } else {
            router.push("/admin/products");
          }
        }
      } finally {
        setInitialLoading(false);
      }
    }
    init();
  }, [params.id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    // Limit total images to 5
    const availableSlots = 5 - existingImages.length;
    const filesToAdd = files.slice(0, availableSlots);
    
    setImageFiles(prev => [...prev, ...filesToAdd]);
    setImageUrls(prev => [...prev, ...filesToAdd.map((f) => URL.createObjectURL(f))]);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (productId: string): Promise<string[]> => {
    const uploaded: string[] = [];
    for (const file of imageFiles) {
      const ext = file.name.split(".").pop();
      const path = `products/${productId}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(path);
        uploaded.push(publicUrl);
      }
    }
    return uploaded;
  };

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    try {
      let finalImages = [...existingImages];

      if (imageFiles.length > 0) {
        setUploadProgress(true);
        const newImages = await uploadImages(params.id as string);
        finalImages = [...finalImages, ...newImages];
        setUploadProgress(false);
      }

      const { error: updateError } = await supabase.from("products").update({
        name: values.name,
        slug: values.slug,
        description: values.description || null,
        price: values.price,
        original_price: values.original_price || null,
        brand: values.brand || null,
        category_id: values.category_id || null,
        is_active: values.is_active,
        is_featured: values.is_featured,
        is_flash_sale: values.is_flash_sale,
        images: finalImages,
      }).eq("id", params.id);

      if (updateError) throw new Error(updateError.message);

      notifications.show({ title: "Product updated!", message: values.name, color: "green", icon: <IconCheck size={16} /> });
      router.push("/admin/products");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      notifications.show({ title: "Error", message: msg, color: "red" });
      setLoading(false);
    }
  });

  if (initialLoading) {
    return (
      <Center style={{ height: "60vh" }}>
        <Loader color="orange" />
      </Center>
    );
  }

  return (
    <Box p={{ base: "md", md: "xl" }} maw={720}>
      <Group mb="xl" pb="md" style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}>
        <Button component={Link} href="/admin/products" variant="subtle" size="xs" color="gray" leftSection={<IconArrowLeft size={14} />}>
          Products
        </Button>
        <Title order={2} fw={800} fz="xl">Edit Product</Title>
      </Group>

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
                }}
              />
              <TextInput
                label="Slug (URL)" required placeholder="samsung-55-qled-tv"
                {...form.getInputProps("slug")}
              />
              <Textarea label="Description" placeholder="Product details..." rows={4} {...form.getInputProps("description")} />
              <TextInput label="Brand" placeholder="e.g. Samsung, Toyota, IKEA" {...form.getInputProps("brand")} />
              <Select
                label="Category"
                placeholder="Select category"
                data={categories.map((c) => ({ value: c.id, label: c.name }))}
                {...form.getInputProps("category_id")}
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
            <Text fz="xs" c="dimmed" mb="md">Upload up to 5 images (JPG, PNG, WEBP).</Text>
            
            {(existingImages.length > 0 || imageUrls.length > 0) && (
              <Group mb="md" gap="sm">
                {existingImages.map((url, i) => (
                  <Box key={`ext-${i}`} style={{ width: 80, height: 80, borderRadius: 6, position: "relative", border: "1px solid var(--mantine-color-gray-3)" }}>
                    <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
                    <Button
                      size="compact-xs" color="red" variant="filled"
                      style={{ position: "absolute", top: -6, right: -6, borderRadius: 100, padding: 0, width: 20, height: 20 }}
                      onClick={() => removeExistingImage(i)}
                    >
                      <IconTrash size={12} />
                    </Button>
                  </Box>
                ))}
                {imageUrls.map((url, i) => (
                  <Box key={`new-${i}`} style={{ width: 80, height: 80, borderRadius: 6, position: "relative", border: "1px solid var(--mantine-color-orange-3)" }}>
                    <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
                    <Button
                      size="compact-xs" color="red" variant="filled"
                      style={{ position: "absolute", top: -6, right: -6, borderRadius: 100, padding: 0, width: 20, height: 20 }}
                      onClick={() => removeNewImage(i)}
                    >
                      <IconTrash size={12} />
                    </Button>
                  </Box>
                ))}
              </Group>
            )}

            {existingImages.length + imageFiles.length < 5 && (
              <label style={{ cursor: "pointer" }}>
                <Box
                  style={{
                    border: "2px dashed var(--mantine-color-gray-3)",
                    borderRadius: 8,
                    padding: "16px",
                    textAlign: "center",
                    backgroundColor: "var(--mantine-color-gray-0)",
                  }}
                >
                  <IconUpload size={20} style={{ color: "var(--mantine-color-gray-5)", marginBottom: 4 }} />
                  <Text fz="sm" c="dimmed">Add more images</Text>
                </Box>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} style={{ display: "none" }} />
              </label>
            )}
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
              {uploadProgress ? "Uploading images..." : "Save Changes"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Box>
  );
}
