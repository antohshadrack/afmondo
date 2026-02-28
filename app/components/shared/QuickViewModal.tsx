"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMediaQuery } from "@mantine/hooks";
import {
  Modal,
  Group,
  Stack,
  Text,
  Badge,
  Button,
  ActionIcon,
  NumberInput,
  Box,
  SimpleGrid,
  Divider,
  ScrollArea,
  CloseButton,
} from "@mantine/core";
import {
  IconShoppingCart,
  IconMinus,
  IconPlus,
  IconArrowRight,
} from "@tabler/icons-react";
import { Product } from "./ProductCard";
import { useCart } from "../../contexts/CartContext";
import { useTranslation } from "../../contexts/TranslationContext";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: () => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const isMobile = useMediaQuery("(max-width: 48em)") ?? false;

  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setSelectedImage(product.image);
    }
  }, [isOpen, product]);

  if (!product) return null;

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    if (onAddToCart) onAddToCart();
    onClose();
  };

  const href = product.slug ? `/product/${product.slug}` : `/product/${product.id}`;

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      size="xl"
      padding={0}
      withCloseButton={false}
      radius={isMobile ? 0 : "lg"}
      fullScreen={isMobile}
      overlayProps={{ backgroundOpacity: 0.85, blur: 3 }}
      transitionProps={{ transition: isMobile ? "slide-up" : "pop", duration: 220 }}
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing={0}>
        {/* Gallery */}
        <Box bg="gray.0" p={{ base: "md", md: "xl" }}>
          <CloseButton
            onClick={onClose}
            size="md"
            style={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}
          />

          {/* Main Image */}
          <Box
            pos="relative"
            style={{
              aspectRatio: "1/1",
              borderRadius: 12,
              overflow: "hidden",
              backgroundColor: "white",
            }}
            mb="md"
          >
            <Image
              src={selectedImage || product.image}
              alt={product.name}
              fill
              style={{ objectFit: "contain", padding: 16 }}
            />
            {product.discount && (
              <Box pos="absolute" top={12} left={12}>
                <Badge color="red" size="md" fw={700} radius="sm">
                  -{product.discount}%
                </Badge>
              </Box>
            )}
          </Box>

          {/* Thumbnails — only show when product has real extra images */}
          {product.images && product.images.length > 1 && (
            <Group gap="sm" wrap="wrap">
              {product.images.map((img, idx) => (
                <Box
                  key={idx}
                  pos="relative"
                  w={56}
                  h={56}
                  style={{
                    borderRadius: 8,
                    overflow: "hidden",
                    cursor: "pointer",
                    border: selectedImage === img
                      ? "2px solid var(--mantine-color-orange-5)"
                      : "2px solid transparent",
                    backgroundColor: "white",
                    transition: "border-color 150ms",
                    flexShrink: 0,
                  }}
                  onClick={() => setSelectedImage(img)}
                >
                  <Image src={img} alt={`View ${idx + 1}`} fill style={{ objectFit: "cover" }} />
                </Box>
              ))}
            </Group>
          )}
        </Box>

        {/* Product Details */}
        <Stack p="xl" gap="md" justify="space-between">
          <Box>
            {product.brand && (
              <Text fz="xs" fw={600} tt="uppercase" c="dimmed" mb={4} style={{ letterSpacing: 1 }}>
                {product.brand}
              </Text>
            )}

            <Text fz="xl" fw={700} c="dark" mb="sm" lh={1.3}>
              {product.name}
            </Text>

            {/* Price */}
            <Group gap="sm" align="baseline" mb="sm">
              <Text fz="2xl" fw={800} c="orange.6">
                {product.price.toLocaleString()} CFA
              </Text>
              {product.originalPrice && (
                <Text fz="md" c="dimmed" td="line-through">
                  {product.originalPrice.toLocaleString()} CFA
                </Text>
              )}
            </Group>

            <Divider mb="md" />

            {/* Description */}
            <Stack gap={4} mb="md">
              <Text fz="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: 1 }}>
                {t("quickView.description")}
              </Text>
              <Text fz="sm" c="dimmed" lh={1.6}>
                {product.description || t("quickView.defaultDescription")}
              </Text>
            </Stack>

            {/* Stock Alert */}
            {product.itemsLeft !== undefined && product.itemsLeft < 10 && (
              <Badge color="red" variant="light" size="md" mb="sm">
                {t("quickView.onlyLeft").replace("{n}", String(product.itemsLeft))}
              </Badge>
            )}
          </Box>

          {/* Actions */}
          <Stack gap="sm">
            {/* Quantity Selector */}
            <Group justify="space-between" align="center">
              <Text fz="sm" fw={500}>
                {t("quickView.quantity")}
              </Text>
              <Group gap={0} style={{ border: "1px solid var(--mantine-color-gray-3)", borderRadius: 8, overflow: "hidden" }}>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  size="lg"
                  radius={0}
                >
                  <IconMinus size={16} />
                </ActionIcon>
                <Box
                  style={{
                    width: 48,
                    textAlign: "center",
                    lineHeight: "36px",
                    fontWeight: 600,
                    borderLeft: "1px solid var(--mantine-color-gray-3)",
                    borderRight: "1px solid var(--mantine-color-gray-3)",
                  }}
                >
                  {quantity}
                </Box>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() => setQuantity((q) => q + 1)}
                  size="lg"
                  radius={0}
                >
                  <IconPlus size={16} />
                </ActionIcon>
              </Group>
            </Group>

            {/* Add to Cart */}
            <Button
              fullWidth
              size="md"
              color="orange"
              leftSection={<IconShoppingCart size={18} />}
              onClick={handleAddToCart}
              radius="md"
            >
              {t("quickView.addToCart")}{quantity > 1 && ` (×${quantity})`}
            </Button>

            {/* Full Details Link */}
            <Button
              component={Link}
              href={href}
              variant="subtle"
              color="gray"
              fullWidth
              size="sm"
              rightSection={<IconArrowRight size={16} />}
              onClick={onClose}
            >
              {t("quickView.viewFullDetails")}
            </Button>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Modal>
  );
}
