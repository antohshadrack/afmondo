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
import {
  carsData,
  tractorsData,
  fridgesData,
  tvsData,
  printingMachinesData,
  furnitureData,
} from "@/app/data/products";
import { Product } from "@/app/components/shared/ProductCard";
import ProductCard from "@/app/components/shared/ProductCard";
import Header from "@/app/components/shared/header";
import Footer from "@/app/components/sections/Footer";
import { useTranslation } from "@/app/contexts/TranslationContext";

/* ── Category config ──────────────────────────────────────── */
interface CategoryConfig {
  title: string;
  titleKey?: string;
  products: Product[];
  breadcrumbs: { label: string; href: string }[];
}

const allVehicles = [...carsData, ...tractorsData];
const allElectronics = [...tvsData, ...printingMachinesData];
const allAppliances = [...fridgesData];
const allMachinery = [...tractorsData]; // placeholder — reuse tractors

function getCategoryConfig(segments: string[]): CategoryConfig | null {
  const path = segments.join("/");

  const map: Record<string, CategoryConfig> = {
    // ── Vehicles ──────────────────────────────────────────────────
    vehicles: {
      title: "Vehicles",
      products: allVehicles,
      breadcrumbs: [{ label: "Vehicles", href: "/vehicles" }],
    },
    "vehicles/cars": {
      title: "Cars",
      products: carsData,
      breadcrumbs: [
        { label: "Vehicles", href: "/vehicles" },
        { label: "Cars", href: "/vehicles/cars" },
      ],
    },
    "vehicles/suvs-trucks": {
      title: "SUVs & Trucks",
      products: carsData,
      breadcrumbs: [
        { label: "Vehicles", href: "/vehicles" },
        { label: "SUVs & Trucks", href: "/vehicles/suvs-trucks" },
      ],
    },
    "vehicles/vans-buses": {
      title: "Vans & Buses",
      products: carsData,
      breadcrumbs: [
        { label: "Vehicles", href: "/vehicles" },
        { label: "Vans & Buses", href: "/vehicles/vans-buses" },
      ],
    },
    "vehicles/tractors": {
      title: "Tractors",
      products: tractorsData,
      breadcrumbs: [
        { label: "Vehicles", href: "/vehicles" },
        { label: "Tractors", href: "/vehicles/tractors" },
      ],
    },
    "vehicles/harvesters": {
      title: "Harvesters",
      products: tractorsData,
      breadcrumbs: [
        { label: "Vehicles", href: "/vehicles" },
        { label: "Harvesters", href: "/vehicles/harvesters" },
      ],
    },
    "vehicles/farm-equipment": {
      title: "Farm Equipment",
      products: tractorsData,
      breadcrumbs: [
        { label: "Vehicles", href: "/vehicles" },
        { label: "Farm Equipment", href: "/vehicles/farm-equipment" },
      ],
    },
    "vehicles/parts": {
      title: "Vehicle Parts",
      products: carsData,
      breadcrumbs: [
        { label: "Vehicles", href: "/vehicles" },
        { label: "Vehicle Parts", href: "/vehicles/parts" },
      ],
    },
    "vehicles/tractor-parts": {
      title: "Tractor Parts",
      products: tractorsData,
      breadcrumbs: [
        { label: "Vehicles", href: "/vehicles" },
        { label: "Tractor Parts", href: "/vehicles/tractor-parts" },
      ],
    },

    // ── Electronics ───────────────────────────────────────────────
    electronics: {
      title: "Electronics",
      products: allElectronics,
      breadcrumbs: [{ label: "Electronics", href: "/electronics" }],
    },
    "electronics/tvs": {
      title: "Televisions",
      products: tvsData,
      breadcrumbs: [
        { label: "Electronics", href: "/electronics" },
        { label: "Televisions", href: "/electronics/tvs" },
      ],
    },
    "electronics/smart-tvs": {
      title: "Smart TVs",
      products: tvsData,
      breadcrumbs: [
        { label: "Electronics", href: "/electronics" },
        { label: "Smart TVs", href: "/electronics/smart-tvs" },
      ],
    },
    "electronics/home-theater": {
      title: "Home Theater",
      products: tvsData,
      breadcrumbs: [
        { label: "Electronics", href: "/electronics" },
        { label: "Home Theater", href: "/electronics/home-theater" },
      ],
    },
    "electronics/printing-machines": {
      title: "Printing Machines",
      products: printingMachinesData,
      breadcrumbs: [
        { label: "Electronics", href: "/electronics" },
        { label: "Printing Machines", href: "/electronics/printing-machines" },
      ],
    },
    "electronics/printers": {
      title: "Printers & Scanners",
      products: printingMachinesData,
      breadcrumbs: [
        { label: "Electronics", href: "/electronics" },
        { label: "Printers & Scanners", href: "/electronics/printers" },
      ],
    },
    "electronics/copiers": {
      title: "Copiers",
      products: printingMachinesData,
      breadcrumbs: [
        { label: "Electronics", href: "/electronics" },
        { label: "Copiers", href: "/electronics/copiers" },
      ],
    },

    // ── Furniture ─────────────────────────────────────────────────
    furniture: {
      title: "Furniture",
      products: furnitureData,
      breadcrumbs: [{ label: "Furniture", href: "/furniture" }],
    },
    "furniture/sofas": {
      title: "Sofas & Couches",
      products: furnitureData,
      breadcrumbs: [
        { label: "Furniture", href: "/furniture" },
        { label: "Sofas & Couches", href: "/furniture/sofas" },
      ],
    },
    "furniture/coffee-tables": {
      title: "Coffee Tables & TV Stands",
      products: furnitureData,
      breadcrumbs: [
        { label: "Furniture", href: "/furniture" },
        { label: "Coffee Tables", href: "/furniture/coffee-tables" },
      ],
    },
    "furniture/beds": {
      title: "Beds",
      products: furnitureData,
      breadcrumbs: [
        { label: "Furniture", href: "/furniture" },
        { label: "Beds", href: "/furniture/beds" },
      ],
    },
    "furniture/wardrobes": {
      title: "Dressers & Wardrobes",
      products: furnitureData,
      breadcrumbs: [
        { label: "Furniture", href: "/furniture" },
        { label: "Wardrobes", href: "/furniture/wardrobes" },
      ],
    },

    // ── Appliances ────────────────────────────────────────────────
    appliances: {
      title: "Appliances",
      products: allAppliances,
      breadcrumbs: [{ label: "Appliances", href: "/appliances" }],
    },
    "appliances/refrigerators": {
      title: "Refrigerators & Freezers",
      products: fridgesData,
      breadcrumbs: [
        { label: "Appliances", href: "/appliances" },
        { label: "Refrigerators", href: "/appliances/refrigerators" },
      ],
    },
    "appliances/microwaves": {
      title: "Microwaves",
      products: fridgesData,
      breadcrumbs: [
        { label: "Appliances", href: "/appliances" },
        { label: "Microwaves", href: "/appliances/microwaves" },
      ],
    },
    "appliances/ovens": {
      title: "Ovens",
      products: fridgesData,
      breadcrumbs: [
        { label: "Appliances", href: "/appliances" },
        { label: "Ovens", href: "/appliances/ovens" },
      ],
    },
    "appliances/washing-machines": {
      title: "Washing Machines",
      products: fridgesData,
      breadcrumbs: [
        { label: "Appliances", href: "/appliances" },
        { label: "Washing Machines", href: "/appliances/washing-machines" },
      ],
    },
    "appliances/dryers": {
      title: "Dryers",
      products: fridgesData,
      breadcrumbs: [
        { label: "Appliances", href: "/appliances" },
        { label: "Dryers", href: "/appliances/dryers" },
      ],
    },

    // ── Machinery ─────────────────────────────────────────────────
    machinery: {
      title: "Industrial Machinery",
      products: allMachinery,
      breadcrumbs: [{ label: "Machinery", href: "/machinery" }],
    },
    "machinery/generators": {
      title: "Generators",
      products: allMachinery,
      breadcrumbs: [
        { label: "Machinery", href: "/machinery" },
        { label: "Generators", href: "/machinery/generators" },
      ],
    },
    "machinery/compressors": {
      title: "Compressors",
      products: allMachinery,
      breadcrumbs: [
        { label: "Machinery", href: "/machinery" },
        { label: "Compressors", href: "/machinery/compressors" },
      ],
    },
    "machinery/excavators": {
      title: "Excavators",
      products: allMachinery,
      breadcrumbs: [
        { label: "Machinery", href: "/machinery" },
        { label: "Excavators", href: "/machinery/excavators" },
      ],
    },
    "machinery/cranes": {
      title: "Cranes",
      products: allMachinery,
      breadcrumbs: [
        { label: "Machinery", href: "/machinery" },
        { label: "Cranes", href: "/machinery/cranes" },
      ],
    },
  };

  return map[path] ?? null;
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

  const config = getCategoryConfig(segments);

  const [sortBy, setSortBy] = useState<string>("default");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [filterOpened, { open: openFilter, close: closeFilter }] = useDisclosure(false);

  const baseProducts = config?.products ?? [];

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

  /* Not found */
  if (!config) {
    return (
      <Box style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }} bg="gray.0">
        <Header />
        <Center style={{ flex: 1 }} p="xl">
          <Stack align="center" gap="md">
            <ThemeIcon size={80} radius="xl" color="orange" variant="light">
              <IconPackageOff size={40} />
            </ThemeIcon>
            <Title order={2}>Category Not Found</Title>
            <Text c="dimmed">This category doesn't exist yet.</Text>
            <Button component={Link} href="/" color="orange" radius="md">
              Back to Home
            </Button>
          </Stack>
        </Center>
        <Footer />
      </Box>
    );
  }

  return (
    <Box style={{ minHeight: "100vh" }} bg="gray.0">
      <Header />

      {/* Breadcrumb */}
      <Box bg="white" style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}>
        <Container size="xl" py="sm">
          <Breadcrumbs separator={<IconChevronRight size={14} />}>
            <Anchor component={Link} href="/" fz="sm" c="dimmed">Home</Anchor>
            {config.breadcrumbs.map((crumb, i) =>
              i < config.breadcrumbs.length - 1 ? (
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
              <Title order={1} fz={{ base: "xl", md: "2xl" }} fw={700}>{config.title}</Title>
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
