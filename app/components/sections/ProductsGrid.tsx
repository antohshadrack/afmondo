"use client";

import { products } from "@/lib/data/products";
import ProductCard from "../shared/ProductCard";
import { useTranslation } from "../../contexts/TranslationContext";
import { Box, SimpleGrid, Title, Text, Stack } from "@mantine/core";

export default function ProductsGrid() {
  const { t } = useTranslation();

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
