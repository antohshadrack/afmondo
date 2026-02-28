"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Container,
  Grid,
  Stack,
  Group,
  Text,
  Title,
  Badge,
  Button,
  ActionIcon,
  Breadcrumbs,
  Anchor,
  Divider,
  Paper,
  ThemeIcon,
  Tabs,
  Loader,
  Center,
  UnstyledButton,
  Tooltip,
  NumberFormatter,
  rem,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconShoppingCart,
  IconHeart,
  IconShare,
  IconArrowLeft,
  IconCheck,
  IconAlertCircle,
  IconMinus,
  IconPlus,
  IconTruck,
  IconRefresh,
  IconShieldCheck,
  IconPackage,
  IconChevronRight,
} from "@tabler/icons-react";
import { Carousel } from "@mantine/carousel";
import { useCart } from "../../contexts/CartContext";
import { useTranslation } from "../../contexts/TranslationContext";
import Header from "../../components/shared/header";
import Footer from "../../components/sections/Footer";
import ProductCard, { Product } from "../../components/shared/ProductCard";
import { getProduct, getProducts, mapDbProduct } from "@/lib/supabase/queries";

const trustItems = [
  {
    icon: <IconTruck size={20} />,
    title: "Free Delivery",
    desc: "On orders over 50,000 CFA",
  },
  {
    icon: <IconRefresh size={20} />,
    title: "7-Day Returns",
    desc: "Hassle-free return policy",
  },
  {
    icon: <IconShieldCheck size={20} />,
    title: "Genuine Products",
    desc: "100% authentic guarantee",
  },
  {
    icon: <IconPackage size={20} />,
    title: "Secure Packaging",
    desc: "Safely delivered to your door",
  },
];

export default function ProductPage() {
  const params = useParams();
  const { t } = useTranslation();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    async function load() {
      if (!params.id) return;
      try {
        setLoading(true);
        const dbProduct = await getProduct(params.id as string);
        if (dbProduct) {
          const mapped = mapDbProduct(dbProduct);
          setProduct(mapped);
          setSelectedImage(mapped.image);
          
          // Get some related products (newest or featured)
          const relatedDb = await getProducts({ limit: 7 });
          setRelatedProducts(relatedDb.filter(p => p.id !== mapped.id).slice(0, 6));
        }
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedToCart(true);
    notifications.show({
      title: t("common.addedToCart"),
      message: `${quantity}× ${product.name}`,
      color: "orange",
      icon: <IconCheck size={16} />,
      autoClose: 2500,
    });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: product?.name, url: window.location.href });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      notifications.show({
        message: "Link copied to clipboard!",
        color: "gray",
        autoClose: 2000,
      });
    }
  };

  /* ─── Loading ─── */
  if (loading) {
    return (
      <Center style={{ minHeight: "100vh" }} bg="gray.0">
        <Loader size="lg" color="orange" />
      </Center>
    );
  }

  /* ─── Not Found ─── */
  if (!product) {
    return (
      <Box style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }} bg="gray.0">
        <Header />
        <Center style={{ flex: 1 }} p="xl">
          <Stack align="center" gap="md">
            <ThemeIcon size={80} radius="xl" color="gray" variant="light">
              <IconAlertCircle size={40} />
            </ThemeIcon>
            <Title order={2}>Product Not Found</Title>
            <Text c="dimmed">The product you're looking for doesn't exist or has been removed.</Text>
            <Button
              component={Link}
              href="/"
              leftSection={<IconArrowLeft size={18} />}
              color="orange"
              radius="md"
            >
              Back to Home
            </Button>
          </Stack>
        </Center>
        <Footer />
      </Box>
    );
  }

  const galleryImages =
    product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <Box style={{ minHeight: "100vh" }} bg="gray.0">
      <Header />

      <Box
        bg="white"
        style={{
          borderBottom: "1px solid var(--mantine-color-gray-2)",
          borderLeft: "4px solid var(--afmondo-orange)",
        }}
      >
        <Container size="xl" py="sm">
          <Breadcrumbs separator={<IconChevronRight size={14} />}>
            <Anchor component={Link} href="/" fz="sm" c="dimmed">
              Home
            </Anchor>
            {product.brand && (
              <Anchor fz="sm" c="dimmed">
                {product.brand}
              </Anchor>
            )}
            <Text fz="sm" fw={500} c="dark" lineClamp={1} maw={300}>
              {product.name}
            </Text>
          </Breadcrumbs>
        </Container>
      </Box>

      <Container size="xl" py={{ base: "md", md: "xl" }}>
        <Grid gutter={{ base: "md", md: "xl" }}>
          {/* ── Left: Image Gallery ── */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="sm">
              {/* Main Image */}
              <Paper
                radius="xl"
                style={{
                  aspectRatio: "1/1",
                  overflow: "hidden",
                  position: "relative",
                  backgroundColor: "white",
                }}
                shadow="xs"
              >
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  priority
                  style={{ objectFit: "contain", padding: 32 }}
                />
                {product.discount && (
                  <Box pos="absolute" top={16} left={16}>
                    <Badge color="red" size="lg" fw={800} radius="md">
                      -{product.discount}% OFF
                    </Badge>
                  </Box>
                )}
                {/* Wishlist */}
                <Box pos="absolute" top={16} right={16}>
                  <ActionIcon
                    size="lg"
                    radius="xl"
                    variant={wishlisted ? "filled" : "light"}
                    color={wishlisted ? "red" : "gray"}
                    onClick={() => setWishlisted((w) => !w)}
                    aria-label="Wishlist"
                  >
                    <IconHeart size={18} />
                  </ActionIcon>
                </Box>
              </Paper>

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <Group gap="sm" wrap="nowrap" style={{ overflowX: "auto", paddingBottom: 4 }}>
                  {galleryImages.map((img, idx) => (
                    <UnstyledButton
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      style={{
                        flexShrink: 0,
                        width: 80,
                        height: 80,
                        borderRadius: 12,
                        overflow: "hidden",
                        border: selectedImage === img
                          ? "2px solid var(--mantine-color-orange-5)"
                          : "2px solid var(--mantine-color-gray-2)",
                        backgroundColor: "white",
                        transition: "border-color 150ms, transform 150ms",
                        transform: selectedImage === img ? "scale(1.05)" : "scale(1)",
                        position: "relative",
                      }}
                    >
                      <Image
                        src={img}
                        alt={`View ${idx + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </UnstyledButton>
                  ))}
                </Group>
              )}
            </Stack>
          </Grid.Col>

          {/* ── Right: Product Details ── */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="md">
              {/* Brand + Badges */}
              <Group gap="sm">
                {product.brand && (
                  <Badge variant="light" color="gray" size="md" radius="md">
                    {product.brand}
                  </Badge>
                )}
                <Badge variant="light" color="green" size="md" radius="md" leftSection={<IconCheck size={12} />}>
                  {t("product.stockLeft")}
                </Badge>
                {product.itemsLeft && product.itemsLeft < 10 && (
                  <Badge variant="light" color="orange" size="md" radius="md" leftSection={<IconAlertCircle size={12} />}>
                    {t("quickView.onlyLeft").replace("{n}", String(product.itemsLeft))}
                  </Badge>
                )}
              </Group>

              {/* Name */}
              <Title order={1} fz={{ base: "xl", md: "2xl" }} fw={700} lh={1.3}>
                {product.name}
              </Title>

              {/* Price */}
              <Box
                p="md"
                style={{
                  backgroundColor: "var(--mantine-color-orange-0)",
                  borderRadius: 12,
                  border: "1px solid var(--mantine-color-orange-2)",
                }}
              >
                <Group align="baseline" gap="sm">
                  <Text fz={{ base: "2xl", md: "3xl" }} fw={800} c="orange.6" ff="monospace">
                    {product.price.toLocaleString("fr-SN")} CFA
                  </Text>
                  {product.originalPrice && (
                    <Text fz="lg" c="dimmed" td="line-through">
                      {product.originalPrice.toLocaleString("fr-SN")} CFA
                    </Text>
                  )}
                </Group>
                {product.discount && (
                  <Text fz="sm" c="green.7" fw={600} mt={4}>
                    You save {((product.originalPrice || 0) - product.price).toLocaleString("fr-SN")} CFA ({product.discount}%)
                  </Text>
                )}
              </Box>

              <Divider />

              {/* Description preview */}
              <Text fz="sm" c="dimmed" lh={1.8}>
                {product.description ||
                  "Experience premium quality with this outstanding product. Designed for durability and performance, it meets all your expectations for modern living standards."}
              </Text>

              <Divider />

              {/* Quantity + Add to Cart */}
              <Stack gap="sm">
                <Group justify="space-between" align="center">
                  <Text fw={600} fz="sm">{t("quickView.quantity")}</Text>
                  <Group
                    gap={0}
                    style={{
                      border: "1.5px solid var(--mantine-color-gray-3)",
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      size={44}
                      radius={0}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      <IconMinus size={16} />
                    </ActionIcon>
                    <Box
                      style={{
                        width: 52,
                        textAlign: "center",
                        lineHeight: "44px",
                        fontWeight: 700,
                        fontSize: 16,
                        borderLeft: "1.5px solid var(--mantine-color-gray-3)",
                        borderRight: "1.5px solid var(--mantine-color-gray-3)",
                      }}
                    >
                      {quantity}
                    </Box>
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      size={44}
                      radius={0}
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      <IconPlus size={16} />
                    </ActionIcon>
                  </Group>
                </Group>

                <Button
                  size="lg"
                  color={addedToCart ? "green" : "orange"}
                  fullWidth
                  radius="xl"
                  leftSection={
                    addedToCart ? <IconCheck size={20} /> : <IconShoppingCart size={20} />
                  }
                  onClick={handleAddToCart}
                  style={{ transition: "background-color 300ms" }}
                >
                  {addedToCart
                    ? t("common.addedToCart")
                    : `${t("product.addToCart")}${quantity > 1 ? ` (×${quantity})` : ""}`}
                </Button>

                <Group gap="sm">
                  <Button
                    variant="light"
                    color="gray"
                    radius="xl"
                    style={{ flex: 1 }}
                    leftSection={<IconHeart size={18} />}
                    onClick={() => setWishlisted((w) => !w)}
                  >
                    {wishlisted ? "Wishlisted" : "Wishlist"}
                  </Button>
                  <Tooltip label="Share product">
                    <ActionIcon
                      variant="light"
                      color="gray"
                      size={44}
                      radius="xl"
                      onClick={handleShare}
                    >
                      <IconShare size={18} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Stack>

              {/* Trust Items */}
              <Grid gutter="xs">
                {trustItems.map((item, i) => (
                  <Grid.Col key={i} span={6}>
                    <Group gap="xs" align="flex-start">
                      <ThemeIcon size={32} radius="md" color="green" variant="light">
                        {item.icon}
                      </ThemeIcon>
                      <Box style={{ flex: 1, minWidth: 0 }}>
                        <Text fz="xs" fw={600} c="dark">
                          {item.title}
                        </Text>
                        <Text fz="xs" c="dimmed">
                          {item.desc}
                        </Text>
                      </Box>
                    </Group>
                  </Grid.Col>
                ))}
              </Grid>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* ── Tabs: Description / Specifications / Shipping ── */}
        <Paper radius="xl" shadow="xs" mt="xl" style={{ overflow: "hidden" }}>
          <Tabs defaultValue="description" color="orange">
            <Tabs.List px="md" pt="xs">
              <Tabs.Tab value="description" fz="sm" fw={600}>
                Description
              </Tabs.Tab>
              <Tabs.Tab value="specs" fz="sm" fw={600}>
                Specifications
              </Tabs.Tab>
              <Tabs.Tab value="shipping" fz="sm" fw={600}>
                Shipping & Returns
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="description" p="xl">
              <Text fz="sm" c="dimmed" lh={1.9} maw={720}>
                {product.description ||
                  "Experience premium quality with this outstanding product from Afmondo. Designed for durability and performance, it meets all your expectations for modern living standards. Every product we sell undergoes strict quality control to ensure you receive only the best. Comes with manufacturer's warranty and Afmondo's 7-day return guarantee."}
              </Text>
            </Tabs.Panel>

            <Tabs.Panel value="specs" p="xl">
              <Stack gap="xs" maw={500}>
                {[
                  ["Brand", product.brand || "N/A"],
                  ["Model", product.name],
                  ["Price", `${product.price.toLocaleString("fr-SN")} CFA`],
                  ["Availability", product.itemsLeft ? `${product.itemsLeft} in stock` : "In Stock"],
                  ["Condition", "Brand New"],
                  ["Warranty", "Manufacturer Warranty Included"],
                ].map(([label, val]) => (
                  <Group
                    key={label}
                    justify="space-between"
                    style={{
                      padding: "10px 0",
                      borderBottom: "1px solid var(--mantine-color-gray-1)",
                    }}
                  >
                    <Text fz="sm" c="dimmed" fw={500}>
                      {label}
                    </Text>
                    <Text fz="sm" fw={600} ta="right">
                      {val}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="shipping" p="xl">
              <Stack gap="md" maw={600}>
                {[
                  {
                    icon: <IconTruck size={20} />,
                    title: "Free Delivery",
                    desc: "Free delivery on orders above 50,000 CFA within major cities in Senegal. Standard delivery takes 2-5 business days.",
                  },
                  {
                    icon: <IconRefresh size={20} />,
                    title: "7-Day Returns",
                    desc: "Not satisfied? Return any product within 7 days of delivery for a full refund, no questions asked.",
                  },
                  {
                    icon: <IconShieldCheck size={20} />,
                    title: "Manufacturer Warranty",
                    desc: "All products come with the manufacturer's original warranty. Contact us for warranty claims.",
                  },
                ].map((item, i) => (
                  <Group key={i} gap="md" align="flex-start">
                    <ThemeIcon size={40} radius="md" color="green" variant="light">
                      {item.icon}
                    </ThemeIcon>
                    <Box style={{ flex: 1 }}>
                      <Text fw={600} fz="sm" mb={4}>
                        {item.title}
                      </Text>
                      <Text fz="sm" c="dimmed" lh={1.7}>
                        {item.desc}
                      </Text>
                    </Box>
                  </Group>
                ))}
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Paper>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <Box mt="xl">
            <Group justify="space-between" align="center" mb="md">
              <Title order={2} fz={{ base: "xl", md: "2xl" }} fw={700}>
                You May Also Like
              </Title>
              <Anchor component={Link} href="/" fz="sm" fw={600} c="orange">
                View all →
              </Anchor>
            </Group>

            <Carousel
              slideSize={{ base: "50%", sm: "33.333%", md: "25%", lg: "16.666%" }}
              slideGap="md"
              withControls
              emblaOptions={{ dragFree: true }}
              styles={{
                control: {
                  backgroundColor: "white",
                  border: "1px solid var(--mantine-color-gray-3)",
                  boxShadow: "var(--mantine-shadow-sm)",
                },
              }}
            >
              {relatedProducts.map((related) => (
                <Carousel.Slide key={related.id}>
                  <ProductCard
                    product={related}
                    variant="carousel"
                    size="full"
                    showActionButtons
                    showBrand
                  />
                </Carousel.Slide>
              ))}
            </Carousel>
          </Box>
        )}
      </Container>

      {/* Sticky mobile CTA bar — always-visible Add to Cart button */}
      <Box
        hiddenFrom="md"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: "white",
          borderTop: "1px solid var(--mantine-color-gray-2)",
          padding: "12px 16px",
          paddingBottom: "max(12px, env(safe-area-inset-bottom))",
          boxShadow: "0 -4px 16px rgba(0,0,0,0.08)",
        }}
      >
        <Group gap="sm" wrap="nowrap">
          {/* Compact qty stepper */}
          <Group
            gap={0}
            style={{
              border: "1.5px solid var(--mantine-color-gray-3)",
              borderRadius: 10,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <ActionIcon
              variant="subtle"
              color="gray"
              size={40}
              radius={0}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              <IconMinus size={14} />
            </ActionIcon>
            <Box style={{ width: 40, textAlign: "center", lineHeight: "40px", fontWeight: 700, fontSize: 15 }}>
              {quantity}
            </Box>
            <ActionIcon
              variant="subtle"
              color="gray"
              size={40}
              radius={0}
              onClick={() => setQuantity((q) => q + 1)}
            >
              <IconPlus size={14} />
            </ActionIcon>
          </Group>

          {/* Add to Cart */}
          <Button
            style={{ flex: 1 }}
            size="md"
            color={addedToCart ? "green" : "orange"}
            radius="xl"
            leftSection={addedToCart ? <IconCheck size={18} /> : <IconShoppingCart size={18} />}
            onClick={handleAddToCart}
          >
            {addedToCart ? t("common.addedToCart") : t("product.addToCart")}
          </Button>
        </Group>
      </Box>

      {/* Bottom padding on mobile so sticky bar doesn't cover content */}
      <Box hiddenFrom="md" style={{ height: 80 }} />

      <Footer />
    </Box>
  );
}
