"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Container,
  Paper,
  Group,
  Stack,
  Text,
  Title,
  Button,
  ActionIcon,
  Divider,
  Center,
  ThemeIcon,
  Anchor,
} from "@mantine/core";
import {
  IconMinus,
  IconPlus,
  IconTrash,
  IconArrowRight,
  IconShoppingBag,
} from "@tabler/icons-react";
import { useCart } from "../contexts/CartContext";
import { useTranslation } from "../contexts/TranslationContext";
import Header from "../components/shared/header";
import Footer from "../components/sections/Footer";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { t } = useTranslation();

  const subtotal = getCartTotal();
  const total = subtotal;

  if (cartItems.length === 0) {
    return (
      <Box style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }} bg="gray.0">
        <Header />
        <Center style={{ flex: 1 }} p="xl">
          <Paper radius="xl" p="xl" shadow="sm" w="100%" maw={400} ta="center">
            <ThemeIcon size={80} radius="xl" color="gray" variant="light" mx="auto" mb="xl">
              <IconShoppingBag size={40} />
            </ThemeIcon>
            <Title order={2} fw={700} mb="xs">{t("cart.title")}</Title>
            <Text c="dimmed" mb="xl">{t("cart.empty")}</Text>
            <Button
              component={Link}
              href="/"
              color="orange"
              size="md"
              rightSection={<IconArrowRight size={18} />}
              fullWidth
              radius="md"
            >
              {t("cart.continueShopping")}
            </Button>
          </Paper>
        </Center>
        <Footer />
      </Box>
    );
  }

  return (
    <Box style={{ minHeight: "100vh" }} bg="gray.0">
      <Header />

      <Container size="xl" py={{ base: "md", md: "xl" }}>
        <Title order={1} fw={700} mb="lg">{t("cart.title")}</Title>

        <Group align="flex-start" gap="xl" wrap="wrap">
          {/* ── Cart Items ──────────────────────────────────────── */}
          <Box style={{ flex: "1 1 600px", minWidth: 0 }}>
            <Paper radius="lg" shadow="sm" style={{ overflow: "hidden" }}>

              {/* Desktop header row */}
              <Box
                visibleFrom="md"
                px="lg"
                py="sm"
                bg="gray.0"
                style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}
              >
                <Group>
                  <Text fz="xs" fw={600} tt="uppercase" c="dimmed" style={{ flex: 6 }}>
                    {t("cart.product")}
                  </Text>
                  <Text fz="xs" fw={600} tt="uppercase" c="dimmed" ta="center" style={{ flex: 2 }}>
                    {t("cart.price")}
                  </Text>
                  <Text fz="xs" fw={600} tt="uppercase" c="dimmed" ta="center" style={{ flex: 2 }}>
                    {t("cart.quantity")}
                  </Text>
                  <Text fz="xs" fw={600} tt="uppercase" c="dimmed" ta="right" style={{ flex: 2 }}>
                    {t("cart.total")}
                  </Text>
                </Group>
              </Box>

              {/* Items */}
              <Stack gap={0}>
                {cartItems.map((item, itemIdx) => (
                  <React.Fragment key={item.id}>
                    <Box p={{ base: "sm", md: "md" }}>

                      {/* ── Mobile layout ── */}
                      <Box hiddenFrom="md">
                        {/* Row 1: image + name + delete */}
                        <Group align="flex-start" gap="sm" wrap="nowrap" mb="sm">
                          {/* Thumbnail */}
                          <Box
                            pos="relative"
                            style={{
                              width: 72,
                              height: 72,
                              flexShrink: 0,
                              borderRadius: 8,
                              overflow: "hidden",
                              backgroundColor: "var(--mantine-color-gray-1)",
                            }}
                          >
                            <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                          </Box>

                          {/* Name + brand (fills available space) */}
                          <Box style={{ flex: 1, minWidth: 0 }}>
                            {item.brand && (
                              <Text fz="xs" c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }}>
                                {item.brand}
                              </Text>
                            )}
                            <Text
                              component={Link}
                              href={item.slug ? `/product/${item.slug}` : `/product/${item.id}`}
                              fw={600}
                              c="dark"
                              fz="sm"
                              lineClamp={2}
                              style={{ textDecoration: "none" }}
                            >
                              {item.name}
                            </Text>
                          </Box>

                          {/* Delete */}
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            size="md"
                            onClick={() => removeFromCart(item.id)}
                            style={{ flexShrink: 0 }}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>

                        {/* Row 2: unit price + qty stepper + line total */}
                        <Group justify="space-between" align="center">
                          {/* Unit price */}
                          <Text fz="sm" c="dimmed">
                            {item.price.toLocaleString("fr-SN")} CFA
                          </Text>

                          {/* Qty stepper */}
                          <Group
                            gap={0}
                            style={{
                              border: "1px solid var(--mantine-color-gray-3)",
                              borderRadius: 8,
                              overflow: "hidden",
                            }}
                          >
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              size="sm"
                              radius={0}
                            >
                              <IconMinus size={12} />
                            </ActionIcon>
                            <Text fw={700} fz="sm" style={{ width: 30, textAlign: "center", lineHeight: "28px" }}>
                              {item.quantity}
                            </Text>
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              size="sm"
                              radius={0}
                            >
                              <IconPlus size={12} />
                            </ActionIcon>
                          </Group>

                          {/* Line total */}
                          <Text fw={700} c="orange.6" fz="sm">
                            {(item.price * item.quantity).toLocaleString("fr-SN")} CFA
                          </Text>
                        </Group>
                      </Box>

                      {/* ── Desktop layout ── */}
                      <Group align="center" gap="md" wrap="nowrap" visibleFrom="md">
                        {/* Thumbnail */}
                        <Box
                          pos="relative"
                          style={{
                            width: 80,
                            height: 80,
                            flexShrink: 0,
                            borderRadius: 8,
                            overflow: "hidden",
                            backgroundColor: "var(--mantine-color-gray-1)",
                          }}
                        >
                          <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                        </Box>

                        {/* Name + brand */}
                        <Box style={{ flex: 6, minWidth: 0 }}>
                          {item.brand && (
                            <Text fz="xs" c="dimmed" tt="uppercase" style={{ letterSpacing: 1 }}>
                              {item.brand}
                            </Text>
                          )}
                          <Text
                            component={Link}
                            href={item.slug ? `/product/${item.slug}` : `/product/${item.id}`}
                            fw={600}
                            c="dark"
                            fz="sm"
                            lineClamp={2}
                            style={{ textDecoration: "none" }}
                          >
                            {item.name}
                          </Text>
                        </Box>

                        {/* Unit price */}
                        <Text fw={500} c="dark" fz="sm" style={{ flex: 2, textAlign: "center" }}>
                          {item.price.toLocaleString("fr-SN")} CFA
                        </Text>

                        {/* Qty */}
                        <Group
                          gap={0}
                          style={{
                            flex: 2,
                            justifyContent: "center",
                            border: "1px solid var(--mantine-color-gray-3)",
                            borderRadius: 8,
                            overflow: "hidden",
                          }}
                        >
                          <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            size="md"
                            radius={0}
                          >
                            <IconMinus size={14} />
                          </ActionIcon>
                          <Text fw={700} fz="sm" style={{ width: 36, textAlign: "center", lineHeight: "32px" }}>
                            {item.quantity}
                          </Text>
                          <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            size="md"
                            radius={0}
                          >
                            <IconPlus size={14} />
                          </ActionIcon>
                        </Group>

                        {/* Line total + remove */}
                        <Box style={{ flex: 2, textAlign: "right" }}>
                          <Text fw={700} c="dark" fz="sm">
                            {(item.price * item.quantity).toLocaleString("fr-SN")} CFA
                          </Text>
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            mt={4}
                            ml="auto"
                            display="flex"
                          >
                            <IconTrash size={14} />
                          </ActionIcon>
                        </Box>
                      </Group>

                    </Box>
                    {itemIdx < cartItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Stack>
            </Paper>
          </Box>

          {/* ── Order Summary ───────────────────────────────────── */}
          <Box style={{ flex: "0 0 320px", width: "100%" }}>
            <Paper
              radius="lg"
              shadow="sm"
              p="xl"
              style={{
                position: "sticky",
                top: 100,
                borderTop: "4px solid var(--afmondo-orange)",
              }}
            >
              <Title order={3} fw={700} mb="lg">{t("cart.summary")}</Title>

              <Stack gap="sm" mb="lg">
                <Group justify="space-between">
                  <Text c="dimmed">{t("cart.subtotal")}</Text>
                  <Text fw={500}>{subtotal.toLocaleString("fr-SN")} CFA</Text>
                </Group>
                <Group justify="space-between">
                  <Text c="dimmed">{t("cart.shipping")}</Text>
                  <Text fz="sm" c="dimmed">{t("cart.shippingCalculated")}</Text>
                </Group>
              </Stack>

              <Divider mb="lg" />

              <Group justify="space-between" mb="xl">
                <Text fw={700}>{t("cart.total")}</Text>
                <Text fz="xl" fw={800} c="orange.6">
                  {total.toLocaleString("fr-SN")} CFA
                </Text>
              </Group>

              <Button
                component={Link}
                href="/checkout"
                fullWidth
                color="orange"
                size="lg"
                radius="md"
                rightSection={<IconArrowRight size={18} />}
              >
                {t("cart.checkout")}
              </Button>

              <Center mt="md">
                <Anchor component={Link} href="/" fz="sm" c="dimmed">
                  {t("cart.continueShopping")}
                </Anchor>
              </Center>
            </Paper>
          </Box>
        </Group>
      </Container>

      <Footer />
    </Box>
  );
}
