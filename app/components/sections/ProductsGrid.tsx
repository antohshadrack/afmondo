"use client";

import { useEffect, useState } from "react";
import ProductCard from "../shared/ProductCard";
import { useTranslation } from "../../contexts/TranslationContext";
import { Box, SimpleGrid, Title, Text, Stack } from "@mantine/core";
import type { Product } from "../shared/ProductCard";
import { createClient } from "@/lib/supabase/client";
import { mapDbProduct } from "@/lib/supabase/queries";

interface ProductsGridProps {
  products?: Product[];
}

export default function ProductsGrid({ products: initialProducts = [] }: ProductsGridProps) {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    const sb = createClient();
    const ch = sb.channel("storefront-products-grid")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, async () => {
        // Specifically for featured products right now
        const { data } = await sb.from("products")
          .select("id, name, slug, price, original_price, discount, images, brand, is_active, is_flash_sale, flash_sale_ends, category_id, description, created_at, is_featured")
          .eq("is_active", true)
          .eq("is_featured", true)
          .order("created_at", { ascending: false })
          .limit(12);
        if (data) setProducts(data.map(mapDbProduct as any));
      }).subscribe();
    return () => { sb.removeChannel(ch); };
  }, []);

  if (products.length === 0) return null;

  return (
    <Box
      component="section"
      py={{ base: "xl", lg: "2xl" }}
      mt={{ base: "lg", md: "xl" }}
    >
      <Box px={{ base: "md", lg: "xl" }} maw={1400} mx="auto">
        {/* Section Header */}
        <Stack align="center" gap="xs" mb="xl">
          <Title order={2} fw={300} fz={{ base: "2xl", md: "3xl" }} c="dark">
            {t("productsGrid.title")}
          </Title>
          <Text c="dimmed" ta="center" maw={600} fz="sm">
            {t("productsGrid.description")}
          </Text>
        </Stack>

        {/* Products Grid */}
        <SimpleGrid
          cols={{ base: 2, sm: 3, md: 4, lg: 5 }}
          spacing={{ base: "sm", md: "md" }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              variant="grid"
              size="full"
              showActionButtons={true}
              textAlign="left"
              accentColor="green"
            />
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
