"use client";

import "./ProductCard.css";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Badge,
  ActionIcon,
  Text,
  Group,
  Stack,
  Progress,
  Box,
  Button,
  Skeleton,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconShoppingCart,
  IconSearch,
  IconTrash,
  IconCheck,
  IconPhoto,
} from "@tabler/icons-react";
import { useTranslation } from "../../contexts/TranslationContext";
import { useCart } from "../../contexts/CartContext";
import QuickViewModal from "./QuickViewModal";

export interface Product {
  id: string | number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  brand?: string;
  asLowAs?: boolean;
  itemsLeft?: number;
  slug?: string;
  description?: string;
  images?: string[];
}

interface ProductCardProps {
  product: Product;
  variant?: "carousel" | "grid" | "flash-sale";
  size?: "sm" | "md" | "lg" | "full";
  showActionButtons?: boolean;
  showBrand?: boolean;
  showProgressBar?: boolean;
  showItemsLeft?: boolean;
  textAlign?: "left" | "center";
  accentColor?: "orange" | "red" | "green";
}

export default function ProductCard({
  product,
  variant = "grid",
  size = "md",
  showActionButtons = true,
  showBrand = false,
  showProgressBar = false,
  showItemsLeft = false,
  textAlign = "left",
  accentColor = "orange",
}: ProductCardProps) {
  const { t } = useTranslation();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const [showQuickView, setShowQuickView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const inCart = isInCart(product.id);
  const href = product.slug ? `/product/${product.slug}` : `/product/${product.id}`;

  const widthMap = { sm: 180, md: 210, lg: 250, full: undefined };
  const cardWidth = widthMap[size];

  const badgeColor = accentColor === "red" ? "red" : accentColor === "green" ? "green" : "orange";

  const showCartNotification = () =>
    notifications.show({
      title: t("common.addedToCart"),
      message: product.name,
      color: "orange",
      icon: <IconCheck size={16} />,
      autoClose: 2500,
    });

  const handleCartAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
      showCartNotification();
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <Box
      style={{
        width: variant === "carousel" ? cardWidth : undefined,
        flexShrink: variant === "carousel" ? 0 : undefined,
      }}
    >
      <Box
        style={{
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid var(--mantine-color-gray-2)",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          transition: "box-shadow 200ms ease, transform 200ms ease",
          boxShadow: hovered ? "0 4px 20px rgba(0,0,0,0.10)" : "0 1px 4px rgba(0,0,0,0.06)",
          transform: hovered ? "translateY(-2px)" : "none",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* ── Image area ─────────────────────────────────── */}
        <Box
          component={Link}
          href={href}
          pos="relative"
          style={{
            aspectRatio: variant === "flash-sale" ? "4/3" : "1/1",
            backgroundColor: "var(--mantine-color-gray-0)",
            overflow: "hidden",
            display: "block",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          {/* Skeleton shown while image loads */}
          {!imgLoaded && !imgError && (
            <Skeleton
              pos="absolute"
              style={{ inset: 0, zIndex: 1 }}
              radius={0}
            />
          )}

          {/* Product image */}
          {!imgError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 600px) 50vw, 25vw"
              style={{
                objectFit: "cover",
                transition: "transform 350ms ease",
                transform: hovered ? "scale(1.06)" : "scale(1)",
                opacity: imgLoaded ? 1 : 0,
              }}
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImgError(true); setImgLoaded(true); }}
            />
          ) : (
            /* Broken image fallback */
            <Box
              pos="absolute"
              style={{
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--mantine-color-gray-1)",
                gap: 6,
              }}
            >
              <IconPhoto size={28} style={{ color: "var(--mantine-color-gray-4)" }} />
              <Text fz="xs" c="dimmed">No image</Text>
            </Box>
          )}

          {/* Hover action buttons — TOP RIGHT corner, no overlay behind them */}
          {showActionButtons && (
            <Box
              visibleFrom="md"
              pos="absolute"
              top={8}
              right={8}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                opacity: hovered ? 1 : 0,
                transform: hovered ? "translateX(0)" : "translateX(8px)",
                transition: "opacity 200ms ease, transform 200ms ease",
                pointerEvents: hovered ? "auto" : "none",
                zIndex: 10,
              }}
            >
              <ActionIcon
                size="md"
                radius="md"
                color={inCart ? "red" : "dark"}
                variant="filled"
                onClick={handleCartAction}
                aria-label={inCart ? "Remove from cart" : "Add to cart"}
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}
              >
                {inCart ? <IconTrash size={15} /> : <IconShoppingCart size={15} />}
              </ActionIcon>
              <ActionIcon
                size="md"
                radius="md"
                color="dark"
                variant="filled"
                onClick={handleQuickView}
                aria-label="Quick view"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }}
              >
                <IconSearch size={15} />
              </ActionIcon>
            </Box>
          )}

          {/* Discount badge — top left */}
          {product.discount && (
            <Box pos="absolute" top={8} left={8} style={{ zIndex: 2 }}>
              <Badge
                color={badgeColor}
                size="sm"
                radius="sm"
                fw={700}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                -{product.discount}%
              </Badge>
            </Box>
          )}

          {/* Brand badge — bottom left if no discount or different position */}
          {showBrand && product.brand && !product.discount && (
            <Box pos="absolute" top={8} left={8} style={{ zIndex: 2 }}>
              <Badge variant="white" color="dark" size="xs" radius="sm" fw={600}>
                {product.brand}
              </Badge>
            </Box>
          )}

          {/* Brand label when discount is also shown */}
          {showBrand && product.brand && product.discount && (
            <Box pos="absolute" bottom={8} left={8} style={{ zIndex: 2 }}>
              <Badge
                variant="filled"
                size="xs"
                radius="sm"
                fw={600}
                style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "white", backdropFilter: "blur(4px)" }}
              >
                {product.brand}
              </Badge>
            </Box>
          )}
        </Box>

        {/* ── Info area ──────────────────────────────────── */}
        <Stack gap={3} p="sm" style={{ flex: 1, textAlign }}>
          {/* Brand text (when showBrand but not using badge) */}
          {showBrand && product.brand && (
            <Text fz="xs" tt="uppercase" c="dimmed" fw={600} style={{ letterSpacing: 0.8 }}>
              {product.brand}
            </Text>
          )}

          {/* Product name */}
          <Text
            component={Link}
            href={href}
            fz="sm"
            fw={500}
            c="dark"
            lineClamp={2}
            style={{
              textDecoration: "none",
              lineHeight: 1.35,
              display: "block",
            }}
          >
            {product.name}
          </Text>

          {/* Price row */}
          <Group gap={6} mt={2} justify={textAlign === "center" ? "center" : "flex-start"} align="baseline">
            <Text fz={{ base: "sm", md: "md" }} fw={800} c="orange.6">
              {product.price.toLocaleString("fr-SN")}
              <Text span fz="xs" fw={500} c="dimmed" ml={2}>CFA</Text>
            </Text>
            {product.originalPrice && (
              <Text fz="xs" c="dimmed" td="line-through">
                {product.originalPrice.toLocaleString("fr-SN")}
              </Text>
            )}
          </Group>

          {/* Progress bar for flash sales */}
          {showProgressBar && showItemsLeft && product.itemsLeft !== undefined && (
            <Box mt={2}>
              <Progress
                value={Math.max(10, (product.itemsLeft / 30) * 100)}
                color={badgeColor}
                size="xs"
                radius="xl"
              />
              <Text fz="xs" c="dimmed" mt={3}>
                {product.itemsLeft} {t("flashSales.itemsLeft")}
              </Text>
            </Box>
          )}

          {/* Mobile cart button */}
          {showActionButtons && (
            <Button
              hiddenFrom="md"
              size="xs"
              radius="sm"
              variant={inCart ? "filled" : "light"}
              color={inCart ? "red" : "orange"}
              leftSection={inCart ? <IconTrash size={13} /> : <IconShoppingCart size={13} />}
              onClick={handleCartAction}
              mt={4}
              fullWidth
            >
              {inCart ? t("cart.remove") : t("cart.add")}
            </Button>
          )}
        </Stack>
      </Box>

      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
        onAddToCart={showCartNotification}
      />
    </Box>
  );
}
