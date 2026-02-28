"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import {
  Box,
  Container,
  Title,
  Text,
  SimpleGrid,
  Group,
  TextInput,
  ActionIcon,
  Badge,
  Select,
  Stack,
  Center,
  ThemeIcon,
  Anchor,
  Skeleton,
  Divider,
  Paper,
} from "@mantine/core";
import {
  IconSearch,
  IconX,
  IconMoodSad,
  IconArrowRight,
  IconSparkles,
} from "@tabler/icons-react";
import Link from "next/link";
import Header from "../components/shared/header";
import Footer from "../components/sections/Footer";
import ProductCard from "../components/shared/ProductCard";
import {
  carsData,
  tractorsData,
  fridgesData,
  tvsData,
  printingMachinesData,
  furnitureData,
} from "../data/products";
import { flashSaleProducts } from "../../lib/data/flashsales";
import { useTranslation } from "../contexts/TranslationContext";
import { Product } from "../components/shared/ProductCard";

const allProducts: Product[] = [
  ...carsData,
  ...tractorsData,
  ...fridgesData,
  ...tvsData,
  ...printingMachinesData,
  ...furnitureData,
  ...(flashSaleProducts as unknown as Product[]),
];

/* Popular searches shown when query is empty */
const popularSearches = [
  "Toyota", "Samsung TV", "Réfrigérateur", "Tracteur", "Canapé", "Imprimante",
];

/* ── Loading skeleton ────────────────────────────────────── */
function SearchSkeleton() {
  return (
    <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="md">
      {Array.from({ length: 10 }).map((_, i) => (
        <Stack key={i} gap="xs">
          <Skeleton height={180} radius="md" />
          <Skeleton height={12} radius="sm" width="70%" />
          <Skeleton height={10} radius="sm" width="40%" />
        </Stack>
      ))}
    </SimpleGrid>
  );
}

/* ── Main search results inner component ─────────────────── */
function SearchResults() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [inputValue, setInputValue] = useState(query);
  const [sortBy, setSortBy] = useState("default");

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.brand?.toLowerCase().includes(lower)
    );
  }, [query]);

  const sorted = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "price-asc") return list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") return list.sort((a, b) => b.price - a.price);
    if (sortBy === "discount") return list.sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));
    return list;
  }, [filteredProducts, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
  };

  return (
    <Box style={{ minHeight: "100vh" }} bg="gray.0">
      <Header />

      {/* ── Search Hero ──────────────────────────────────── */}
      <Box
        py={{ base: "lg", md: "xl" }}
        bg="white"
        style={{ borderBottom: "2px solid var(--mantine-color-orange-3)" }}
      >
        <Container size="xl">
          <Stack gap="md" align="center">
            <form onSubmit={handleSearch} style={{ width: "100%", maxWidth: 580 }}>
              <TextInput
                size="lg"
                radius="xl"
                placeholder={t("navigation.searchPlaceholder")}
                value={inputValue}
                onChange={(e) => setInputValue(e.currentTarget.value)}
                leftSection={<IconSearch size={20} color="var(--mantine-color-orange-6)" />}
                rightSection={
                  inputValue ? (
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      size="sm"
                      onClick={() => setInputValue("")}
                      radius="xl"
                    >
                      <IconX size={14} />
                    </ActionIcon>
                  ) : (
                    <ActionIcon
                      type="submit"
                      color="orange"
                      variant="filled"
                      radius="xl"
                      size="md"
                    >
                      <IconArrowRight size={16} />
                    </ActionIcon>
                  )
                }
                styles={{
                  input: {
                    border: "2px solid var(--mantine-color-orange-3)",
                    "&:focus": { borderColor: "var(--mantine-color-orange-5)" },
                  },
                }}
              />
            </form>

            {/* Popular searches (shown when no query) */}
            {!query.trim() && (
              <Group gap="xs" justify="center">
                <Text fz="xs" c="dimmed">Popular:</Text>
                {popularSearches.map((term) => (
                  <Anchor
                    key={term}
                    component={Link}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    fz="xs"
                    fw={500}
                    c="orange.6"
                    style={{
                      backgroundColor: "var(--mantine-color-orange-0)",
                      padding: "2px 10px",
                      borderRadius: 20,
                      border: "1px solid var(--mantine-color-orange-2)",
                    }}
                  >
                    {term}
                  </Anchor>
                ))}
              </Group>
            )}
          </Stack>
        </Container>
      </Box>

      <Container size="xl" py={{ base: "md", md: "xl" }}>
        {/* ── Empty state: no query ────────────────────── */}
        {!query.trim() ? (
          <Center py="xl">
            <Stack align="center" gap="md" maw={400} ta="center">
              <ThemeIcon size={72} radius="xl" color="orange" variant="light">
                <IconSparkles size={36} />
              </ThemeIcon>
              <Title order={2} fw={700}>Discover Products</Title>
              <Text c="dimmed" fz="sm">
                Search across vehicles, electronics, furniture, appliances,
                and more. Use the search bar above to find what you need.
              </Text>

              <Divider w="100%" label="Browse by category" labelPosition="center" my="md" />

              <SimpleGrid cols={2} spacing="sm" w="100%">
                {[
                  { label: "🚗 Vehicles", href: "/vehicles" },
                  { label: "📺 Electronics", href: "/electronics" },
                  { label: "🛋️ Furniture", href: "/furniture" },
                  { label: "❄️ Appliances", href: "/appliances" },
                  { label: "🚜 Tractors", href: "/vehicles/tractors" },
                  { label: "🖨️ Printers", href: "/electronics/printing-machines" },
                ].map((cat) => (
                  <Paper
                    key={cat.href}
                    component={Link}
                    href={cat.href}
                    radius="md"
                    p="sm"
                    withBorder
                    style={{
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "border-color 150ms, background 150ms",
                    }}
                    styles={{
                      root: { "&:hover": { borderColor: "var(--mantine-color-orange-4)", backgroundColor: "var(--mantine-color-orange-0)" } },
                    }}
                  >
                    <Text fz="sm" fw={500} c="dark" ta="center">{cat.label}</Text>
                  </Paper>
                ))}
              </SimpleGrid>
            </Stack>
          </Center>
        ) : (
          <>
            {/* ── Results header ───────────────────────── */}
            <Group justify="space-between" align="center" mb="lg" wrap="wrap" gap="sm">
              <Box>
                <Group gap="xs" align="center" wrap="wrap">
                  <Title order={2} fz={{ base: "lg", md: "xl" }} fw={700}>
                    Results for
                  </Title>
                  <Badge
                    color="orange"
                    variant="light"
                    size="lg"
                    radius="md"
                    style={{ fontStyle: "italic" }}
                  >
                    "{query}"
                  </Badge>
                </Group>
                <Text fz="sm" c="dimmed" mt={4}>
                  {sorted.length} {sorted.length === 1 ? "product" : "products"} found
                </Text>
              </Box>

              {sorted.length > 0 && (
                <Select
                  value={sortBy}
                  onChange={(v) => setSortBy(v ?? "default")}
                  data={[
                    { value: "default", label: "Best Match" },
                    { value: "price-asc", label: "Price: Low → High" },
                    { value: "price-desc", label: "Price: High → Low" },
                    { value: "discount", label: "Best Discount" },
                  ]}
                  size="sm"
                  w={180}
                  styles={{ input: { borderRadius: 8 } }}
                />
              )}
            </Group>

            {/* ── No results ───────────────────────────── */}
            {sorted.length === 0 ? (
              <Center py="xl">
                <Stack align="center" gap="md" maw={380} ta="center">
                  <ThemeIcon size={72} radius="xl" color="gray" variant="light">
                    <IconMoodSad size={36} />
                  </ThemeIcon>
                  <Title order={3} fw={700}>No results found</Title>
                  <Text c="dimmed" fz="sm">
                    We couldn't find any products matching{" "}
                    <Text span fw={600} c="dark">"{query}"</Text>.
                    Try different keywords or browse a category.
                  </Text>

                  <Group gap="xs" wrap="wrap" justify="center" mt="xs">
                    {popularSearches.map((term) => (
                      <Anchor
                        key={term}
                        component={Link}
                        href={`/search?q=${encodeURIComponent(term)}`}
                        fz="xs"
                        fw={500}
                        c="orange.7"
                        style={{
                          backgroundColor: "var(--mantine-color-orange-0)",
                          padding: "3px 12px",
                          borderRadius: 20,
                          border: "1px solid var(--mantine-color-orange-2)",
                        }}
                      >
                        {term}
                      </Anchor>
                    ))}
                  </Group>
                </Stack>
              </Center>
            ) : (
              /* ── Product grid ───────────────────────── */
              <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="md">
                {sorted.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="grid"
                    size="full"
                    showBrand
                    showActionButtons
                  />
                ))}
              </SimpleGrid>
            )}
          </>
        )}
      </Container>

      <Footer />
    </Box>
  );
}

/* ── Suspense shell ──────────────────────────────────────── */
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <Box bg="gray.0" style={{ minHeight: "100vh" }}>
          <Container size="xl" pt="xl">
            <SearchSkeleton />
          </Container>
        </Box>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
