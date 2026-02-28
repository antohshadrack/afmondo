"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Container,
  Grid,
  Stack,
  Text,
  Title,
  Breadcrumbs,
  Anchor,
  Select,
  Group,
  Badge,
  Paper,
  RangeSlider,
  Checkbox,
  Button,
  Divider,
  Drawer,
  ActionIcon,
  SimpleGrid,
  Center,
  ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronRight, IconFilter, IconX, IconPackageOff } from "@tabler/icons-react";
import Header from "@/app/components/shared/header";
import Footer from "@/app/components/sections/Footer";
import { useTranslation } from "@/app/contexts/TranslationContext";
import ProductCard from "@/app/components/shared/ProductCard";
import { getProducts } from "@/lib/supabase/queries";

function formatTitle(slug: string) {
  return slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

/* ── Filter Panel ─────────────────────────────────────────── */
function FilterPanel({
  brands,
  selectedBrands,
  onBrandToggle,
  priceRange,
  maxPrice,
  onPriceChange,
  onReset,
}: {
  brands: string[];
  selectedBrands: string[];
  onBrandToggle: (b: string) => void;
  priceRange: [number, number];
  maxPrice: number;
  onPriceChange: (v: [number, number]) => void;
  onReset: () => void;
}) {
  return (
    <Stack gap="lg">
      {/* Price range */}
      <Box>
        <Text fw={600} fz="sm" mb="sm">Price (CFA)</Text>
        <RangeSlider
          min={0}
          max={maxPrice}
          step={1000}
          value={priceRange}
          onChange={onPriceChange}
          color="orange"
          label={(v) => `${v.toLocaleString("fr-SN")}`}
          minRange={5000}
        />
        <Group justify="space-between" mt="xs">
          <Text fz="xs" c="dimmed">{priceRange[0].toLocaleString("fr-SN")} CFA</Text>
          <Text fz="xs" c="dimmed">{priceRange[1].toLocaleString("fr-SN")} CFA</Text>
        </Group>
      </Box>

      <Divider />

      {/* Brands */}
      {brands.length > 0 && (
        <Box>
          <Text fw={600} fz="sm" mb="sm">Brand</Text>
          <Stack gap="xs">
            {brands.map((brand) => (
              <Checkbox
                key={brand}
                label={brand}
                checked={selectedBrands.includes(brand)}
                onChange={() => onBrandToggle(brand)}
                color="orange"
                size="sm"
              />
            ))}
          </Stack>
        </Box>
      )}

      <Button variant="subtle" color="gray" size="xs" onClick={onReset}>
        Reset filters
      </Button>
    </Stack>
  );
}

/* ── Main Page ────────────────────────────────────────────── */
export default function CategoryPage() {
  const params = useParams();
  const { t } = useTranslation();
  const segments = Array.isArray(params.category)
    ? params.category
    : [params.category as string];

  const [sortBy, setSortBy] = useState<string>("default");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [filterOpened, { open: openFilter, close: closeFilter }] = useDisclosure(false);
  const [baseProducts, setBaseProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const slug = segments[segments.length - 1];
    getProducts({ categorySlug: slug })
      .then(setBaseProducts)
      .finally(() => setLoading(false));
  }, [segments.join("-")]);

  const maxPrice = useMemo(
    () => Math.max(...baseProducts.map((p) => p.price), 100000),
    [baseProducts]
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

  const brands = useMemo(
    () => [...new Set(baseProducts.map((p) => p.brand).filter(Boolean) as string[])].sort(),
    [baseProducts]
  );

  const filtered = useMemo(() => {
    let result = baseProducts.filter(
      (p) =>
        p.price >= priceRange[0] &&
        p.price <= priceRange[1] &&
        (selectedBrands.length === 0 || (p.brand && selectedBrands.includes(p.brand)))
    );
    if (sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === "discount") result = [...result].sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));
    return result;
  }, [baseProducts, priceRange, selectedBrands, sortBy]);

  const handleBrandToggle = (brand: string) =>
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );

  const handleReset = () => {
    setSelectedBrands([]);
    setPriceRange([0, maxPrice]);
    setSortBy("default");
  };

  if (loading) {
    return (
      <Box style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }} bg="gray.0">
        <Header />
        <Center style={{ flex: 1 }} p="xl">
          <Text c="dimmed">Loading category products...</Text>
        </Center>
        <Footer />
      </Box>
    );
  }

  // Generate dynamic breadcrumbs from segments
  const breadcrumbs = segments.map((seg, i) => {
    const path = `/${segments.slice(0, i + 1).join("/")}`;
    return { label: formatTitle(seg), href: path };
  });
  
  const title = formatTitle(segments[segments.length - 1]);

  return (
    <Box style={{ minHeight: "100vh" }} bg="gray.0">
      <Header />

      {/* Breadcrumb */}
      <Box bg="white" style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}>
        <Container size="xl" py="sm">
          <Breadcrumbs separator={<IconChevronRight size={14} />}>
            <Anchor component={Link} href="/" fz="sm" c="dimmed">Home</Anchor>
            {breadcrumbs.map((crumb, i) =>
              i < breadcrumbs.length - 1 ? (
                <Anchor key={crumb.href} component={Link} href={crumb.href} fz="sm" c="dimmed">
                  {crumb.label}
                </Anchor>
              ) : (
                <Text key={crumb.href} fz="sm" fw={500} c="dark">{crumb.label}</Text>
              )
            )}
          </Breadcrumbs>
        </Container>
      </Box>

      <Container size="xl" py={{ base: "md", md: "xl" }}>
      {/* Page header row */}
        <Box
          mb="lg"
          px={{ base: "md", md: "xl" }}
          py={{ base: "sm", md: "md" }}
          mx={{ base: "-md", md: "-xl" }}
          bg="white"
          style={{
            borderBottom: "1px solid var(--mantine-color-gray-2)",
            borderLeft: "5px solid var(--afmondo-orange)",
          }}
        >
          <Group justify="space-between" align="center" wrap="wrap" gap="sm">
            <Box>
              <Title order={1} fz={{ base: "xl", md: "2xl" }} fw={700}>{title}</Title>
              <Group gap="xs" mt={4}>
                <Text fz="sm" c="dimmed">{filtered.length} products</Text>
              </Group>
            </Box>

            <Group gap="sm">
              {/* Mobile filter button */}
              <Button
                variant="default"
                leftSection={<IconFilter size={16} />}
                hiddenFrom="md"
                onClick={openFilter}
                size="sm"
              >
                Filters{selectedBrands.length > 0 || priceRange[0] > 0 ? ` (${selectedBrands.length + (priceRange[0] > 0 ? 1 : 0)})` : ""}
              </Button>

              {/* Sort */}
              <Select
                value={sortBy}
                onChange={(v) => setSortBy(v ?? "default")}
                data={[
                  { value: "default", label: "Default" },
                  { value: "price-asc", label: "Price: Low to High" },
                  { value: "price-desc", label: "Price: High to Low" },
                  { value: "discount", label: "Best Discount" },
                ]}
                size="sm"
                w={180}
                styles={{ input: { borderRadius: 8 } }}
              />
            </Group>
          </Group>
        </Box>

        {/* Active filter badges */}
        {(selectedBrands.length > 0) && (
          <Group gap="xs" mb="md">
            {selectedBrands.map((b) => (
              <Badge
                key={b}
                variant="light"
                color="orange"
                rightSection={
                  <ActionIcon size="xs" variant="transparent" color="orange" onClick={() => handleBrandToggle(b)}>
                    <IconX size={10} />
                  </ActionIcon>
                }
              >
                {b}
              </Badge>
            ))}
          </Group>
        )}

        <Grid gutter="xl">
          {/* ── Desktop Sidebar ───────────────────────── */}
          <Grid.Col span={{ base: 12, md: 3 }} visibleFrom="md">
            <Paper
              radius="lg"
              shadow="xs"
              p="lg"
              style={{
                position: "sticky",
                top: 90,
                borderTop: "3px solid var(--afmondo-orange)",
              }}
            >
              <Group justify="space-between" mb="md">
                <Text fw={700} fz="sm">Filters</Text>
                {(selectedBrands.length > 0 || priceRange[0] > 0) && (
                  <Anchor fz="xs" c="orange" onClick={handleReset}>Reset</Anchor>
                )}
              </Group>
              <FilterPanel
                brands={brands}
                selectedBrands={selectedBrands}
                onBrandToggle={handleBrandToggle}
                priceRange={priceRange}
                maxPrice={maxPrice}
                onPriceChange={setPriceRange}
                onReset={handleReset}
              />
            </Paper>
          </Grid.Col>

          {/* ── Product Grid ──────────────────────────── */}
          <Grid.Col span={{ base: 12, md: 9 }}>
            {filtered.length === 0 ? (
              <Center py="xl">
                <Stack align="center" gap="md">
                  <ThemeIcon size={64} radius="xl" color="gray" variant="light">
                    <IconPackageOff size={32} />
                  </ThemeIcon>
                  <Text c="dimmed" ta="center">No products match your filters.<br />Try adjusting the price range or removing brand filters.</Text>
                  <Button variant="light" color="orange" onClick={handleReset} size="sm">Clear Filters</Button>
                </Stack>
              </Center>
            ) : (
              <SimpleGrid cols={{ base: 2, sm: 3, lg: 4 }} spacing="md">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="grid"
                    size="full"
                    showBrand
                  />
                ))}
              </SimpleGrid>
            )}
          </Grid.Col>
        </Grid>
      </Container>

      {/* Mobile filter drawer */}
      <Drawer
        opened={filterOpened}
        onClose={closeFilter}
        title="Filters"
        position="bottom"
        size="75%"
        radius="lg"
        styles={{ body: { padding: 20 } }}
      >
        <FilterPanel
          brands={brands}
          selectedBrands={selectedBrands}
          onBrandToggle={handleBrandToggle}
          priceRange={priceRange}
          maxPrice={maxPrice}
          onPriceChange={setPriceRange}
          onReset={handleReset}
        />
        <Button fullWidth color="orange" mt="lg" radius="md" onClick={closeFilter}>
          Show {filtered.length} results
        </Button>
      </Drawer>

      <Footer />
    </Box>
  );
}
