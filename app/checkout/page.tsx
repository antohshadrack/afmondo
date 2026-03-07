"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Box, Container, Grid, Paper, Stack, Group, Text, Title,
  TextInput, Button, Divider, Center, ThemeIcon, Badge,
  Anchor, rem,
} from "@mantine/core";
import { useForm, isEmail, hasLength } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconShoppingBag, IconCheck, IconArrowLeft, IconPhone,
  IconMail, IconUser, IconClock, IconBrandWhatsapp,
  IconCopy, IconArrowRight,
} from "@tabler/icons-react";
import { useCart } from "../contexts/CartContext";
import Header from "../components/shared/header";
import Footer from "../components/sections/Footer";
import { createClient } from "@/lib/supabase/client";

/* ────────────────────────────────────────────────────────────
   Types
─────────────────────────────────────────────────────────── */
interface CheckoutForm {
  full_name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
}

interface ConfirmedOrder {
  id: string;
  shortId: string;
  total: number;
  full_name: string;
}

/* ────────────────────────────────────────────────────────────
   Helpers
─────────────────────────────────────────────────────────── */
function shortOrderId(uuid: string) {
  // Return last 8 chars of UUID uppercased: e.g. AFM-4A2B3C1D
  return "AFM-" + uuid.replace(/-/g, "").slice(-8).toUpperCase();
}

/* ────────────────────────────────────────────────────────────
   Confirmation Screen
─────────────────────────────────────────────────────────── */
function OrderConfirmed({ order, onCopy }: { order: ConfirmedOrder; onCopy: () => void }) {
  return (
    <Box style={{ minHeight: "100vh" }} bg="gray.0">
      <Header />
      <Container size="sm" py={{ base: "xl", md: "4rem" }}>
        <Paper radius="xl" shadow="md" p={{ base: "xl", md: "3rem" }} style={{ borderTop: "4px solid var(--afmondo-orange)" }}>
          <Stack align="center" gap="lg">
            {/* Success icon */}
            <ThemeIcon size={80} radius="xl" color="green" variant="light">
              <IconCheck size={40} stroke={2.5} />
            </ThemeIcon>

            <Title order={2} fw={800} ta="center">Order Placed Successfully!</Title>
            <Text c="dimmed" ta="center" maw={400}>
              Thank you, <strong>{order.full_name}</strong>! Our team will contact you within{" "}
              <strong>2 hours</strong> to confirm your order and arrange delivery.
            </Text>

            {/* Order ID chip */}
            <Box
              style={{
                background: "linear-gradient(135deg, var(--afmondo-orange) 0%, #e5951a 100%)",
                borderRadius: 12,
                padding: "16px 32px",
                textAlign: "center",
                width: "100%",
                maxWidth: 340,
              }}
            >
              <Text fz="xs" fw={600} c="white" tt="uppercase" style={{ letterSpacing: 2, opacity: 0.85 }}>
                Your Order ID
              </Text>
              <Text fz="2xl" fw={900} c="white" style={{ letterSpacing: 3, fontVariantNumeric: "tabular-nums" }}>
                {order.shortId}
              </Text>
              <Button
                variant="white"
                color="orange"
                size="xs"
                mt="xs"
                leftSection={<IconCopy size={12} />}
                onClick={onCopy}
                radius="md"
              >
                Copy Order ID
              </Button>
            </Box>

            {/* What happens next */}
            <Paper radius="lg" p="lg" bg="orange.0" style={{ border: "1px solid var(--mantine-color-orange-2)", width: "100%" }}>
              <Text fw={700} fz="sm" mb="sm">What happens next?</Text>
              <Stack gap="xs">
                {[
                  { icon: <IconClock size={16} />, text: "You'll receive a call or WhatsApp within 2 hours" },
                  { icon: <IconPhone size={16} />, text: "We confirm your items, location & delivery details" },
                  { icon: <IconShoppingBag size={16} />, text: "Your order is prepared and dispatched" },
                ].map((step, i) => (
                  <Group key={i} gap="sm" align="flex-start">
                    <ThemeIcon size={28} radius="xl" color="orange" variant="light" style={{ flexShrink: 0 }}>
                      {step.icon}
                    </ThemeIcon>
                    <Text fz="sm" c="dimmed" style={{ flex: 1 }}>{step.text}</Text>
                  </Group>
                ))}
              </Stack>
            </Paper>

            <Text fz="xs" c="dimmed" ta="center">
              Save your Order ID <strong>{order.shortId}</strong> for reference.
            </Text>

            <Divider w="100%" />

            <Group>
              <Button
                component={Link}
                href="/"
                variant="default"
                leftSection={<IconArrowLeft size={16} />}
                radius="md"
              >
                Back to Home
              </Button>
              <Button
                component={Link}
                href="/track"
                color="orange"
                rightSection={<IconArrowRight size={16} />}
                radius="md"
              >
                Track Order
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
}

/* ────────────────────────────────────────────────────────────
   Main Checkout Page
─────────────────────────────────────────────────────────── */
export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<ConfirmedOrder | null>(null);

  const subtotal = getCartTotal();
  const supabase = createClient();

  const form = useForm<CheckoutForm>({
    initialValues: {
      full_name: "",
      email: "",
      phone: "",
      city: "",
      address: "",
      notes: "",
    },
    validate: {
      full_name: hasLength({ min: 2 }, "Full name is required"),
      email: (v) => v.trim() && !isEmail(v) ? "Enter a valid email address" : null,
      phone: (v) => !v.trim() ? "Phone / WhatsApp number is required" : null,
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    if (cartItems.length === 0) return;
    setSubmitting(true);
    try {
      // Build order_items payload
      const orderItems = cartItems.map((item) => ({
        product_id: item.id,
        name: item.name,
        image: item.image ?? null,
        price: item.price,
        quantity: item.quantity,
      }));

      // Insert order
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          status: "pending",
          total: subtotal,
          delivery_fee: 0,
          delivery_name: values.full_name,
          delivery_phone: values.phone,
          delivery_city: values.city || null,
          delivery_address: values.address || null,
          notes: [
            values.email ? `Email: ${values.email}` : null,
            values.notes ? `Notes: ${values.notes}` : null,
          ].filter(Boolean).join(" | ") || null,
        })
        .select()
        .single();

      if (error || !order) throw new Error(error?.message ?? "Order failed");

      // Insert order items
      if (orderItems.length > 0) {
        await supabase.from("order_items").insert(
          orderItems.map((item) => ({ ...item, order_id: order.id }))
        );
      }

      // Clear cart and show confirmation
      clearCart();
      setConfirmed({
        id: order.id,
        shortId: shortOrderId(order.id),
        total: subtotal,
        full_name: values.full_name,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      notifications.show({ title: "Error", message: msg, color: "red" });
      setSubmitting(false);
    }
  });

  const handleCopyOrderId = () => {
    if (!confirmed) return;
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(confirmed.shortId);
      notifications.show({ title: "Copied!", message: confirmed.shortId, color: "green", icon: <IconCheck size={14} /> });
    } else {
      // Fallback for non-secure contexts (like testing via local IP on mobile)
      const textArea = document.createElement("textarea");
      textArea.value = confirmed.shortId;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand("copy");
        notifications.show({ title: "Copied!", message: confirmed.shortId, color: "green", icon: <IconCheck size={14} /> });
      } catch (err) {
        notifications.show({ title: "Could not copy automatically", message: "Please manually select and copy the Order ID.", color: "orange" });
      }
      
      document.body.removeChild(textArea);
    }
  };

  // ── Confirmed state ──────────────────────────────────────
  if (confirmed) {
    return <OrderConfirmed order={confirmed} onCopy={handleCopyOrderId} />;
  }

  // ── Empty cart ───────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <Box style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }} bg="gray.0">
        <Header />
        <Center style={{ flex: 1 }} p="xl">
          <Paper radius="xl" p="xl" shadow="sm" w="100%" maw={400} ta="center">
            <ThemeIcon size={80} radius="xl" color="gray" variant="light" mx="auto" mb="xl">
              <IconShoppingBag size={40} />
            </ThemeIcon>
            <Title order={2} fw={700} mb="xs">Your cart is empty</Title>
            <Text c="dimmed" mb="xl">Add some items before checking out.</Text>
            <Button component={Link} href="/" color="orange" size="md" fullWidth radius="md">
              Continue Shopping
            </Button>
          </Paper>
        </Center>
        <Footer />
      </Box>
    );
  }

  // ── Checkout form ────────────────────────────────────────
  return (
    <Box style={{ minHeight: "100vh" }} bg="gray.0">
      <Header />

      <Container size="xl" py={{ base: "md", md: "xl" }}>
        {/* Breadcrumb */}
        <Group mb="lg" gap={4} fz="sm">
          <Anchor component={Link} href="/cart" c="dimmed">Cart</Anchor>
          <Text c="dimmed">›</Text>
          <Text fw={600}>Checkout</Text>
        </Group>

        <Grid gutter="xl">
          {/* ── Left: Form ───────────────────────────────── */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <form onSubmit={handleSubmit}>
              <Stack gap="lg">

                {/* Contact Details */}
                <Paper radius="lg" shadow="sm" p="xl" style={{ borderTop: "3px solid var(--afmondo-orange)" }}>
                  <Text fw={700} fz="lg" mb="lg">Contact Details</Text>
                  <Stack gap="md">
                    <TextInput
                      label="Full Name"
                      placeholder="e.g. Moustafa Diop"
                      required
                      leftSection={<IconUser size={16} />}
                      {...form.getInputProps("full_name")}
                    />
                    <Grid>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <TextInput
                          label="Phone / WhatsApp"
                          placeholder="+221 77 000 0000"
                          required
                          leftSection={<IconBrandWhatsapp size={16} color="var(--mantine-color-green-6)" />}
                          description="We'll contact you on this number"
                          {...form.getInputProps("phone")}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <TextInput
                          label="Email (optional)"
                          placeholder="you@example.com"
                          leftSection={<IconMail size={16} />}
                          {...form.getInputProps("email")}
                        />
                      </Grid.Col>
                    </Grid>
                  </Stack>
                </Paper>

                {/* Delivery Info */}
                <Paper radius="lg" shadow="sm" p="xl">
                  <Group mb="lg" align="center" gap="xs">
                    <Text fw={700} fz="lg">Delivery Information</Text>
                    <Badge color="gray" variant="light" size="sm">Optional</Badge>
                  </Group>
                  <Stack gap="md">
                    <TextInput
                      label="City / Region"
                      placeholder="e.g. Dakar, Thiès, Saint-Louis…"
                      {...form.getInputProps("city")}
                    />
                    <TextInput
                      label="Address / Landmark"
                      placeholder="e.g. Rue 10 x 23, near the mosque"
                      {...form.getInputProps("address")}
                    />
                    <TextInput
                      label="Notes for the team"
                      placeholder="Any special instructions…"
                      {...form.getInputProps("notes")}
                    />
                  </Stack>
                </Paper>

                {/* Notice */}
                <Paper radius="lg" p="md" bg="blue.0" style={{ border: "1px solid var(--mantine-color-blue-2)" }}>
                  <Group gap="sm" align="flex-start">
                    <ThemeIcon size={32} radius="xl" color="blue" variant="light" style={{ flexShrink: 0 }}>
                      <IconClock size={16} />
                    </ThemeIcon>
                    <Box>
                      <Text fw={600} fz="sm">No online payment required</Text>
                      <Text c="dimmed" fz="xs" mt={2}>
                        After placing your order, our team will call or WhatsApp you within <strong>2 hours</strong> to confirm 
                        your items, arrange delivery and discuss payment.
                      </Text>
                    </Box>
                  </Group>
                </Paper>

                <Button
                  type="submit"
                  color="orange"
                  size="lg"
                  radius="md"
                  fullWidth
                  loading={submitting}
                  rightSection={!submitting && <IconArrowRight size={18} />}
                >
                  {submitting ? "Placing Order…" : "Place Order"}
                </Button>
              </Stack>
            </form>
          </Grid.Col>

          {/* ── Right: Order Summary ─────────────────────── */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper
              radius="lg"
              shadow="sm"
              p="xl"
              style={{ position: "sticky", top: 90, borderTop: "3px solid var(--mantine-color-gray-3)" }}
            >
              <Text fw={700} fz="lg" mb="lg">Order Summary</Text>

              <Stack gap={0}>
                {cartItems.map((item, i) => (
                  <Box key={item.id}>
                    <Group gap="sm" py="sm" wrap="nowrap">
                      {/* Thumbnail */}
                      <Box
                        pos="relative"
                        style={{ width: 56, height: 56, flexShrink: 0, borderRadius: 8, overflow: "hidden", backgroundColor: "var(--mantine-color-gray-1)" }}
                      >
                        <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                      </Box>
                      {/* Name + qty */}
                      <Box style={{ flex: 1, minWidth: 0 }}>
                        <Text fz="sm" fw={600} lineClamp={2}>{item.name}</Text>
                        {item.brand && <Text fz="xs" c="dimmed">{item.brand}</Text>}
                        <Badge size="xs" variant="light" color="gray" mt={2}>Qty: {item.quantity}</Badge>
                      </Box>
                      {/* Line total */}
                      <Text fw={700} fz="sm" style={{ flexShrink: 0 }}>
                        {(item.price * item.quantity).toLocaleString("fr-SN")} CFA
                      </Text>
                    </Group>
                    {i < cartItems.length - 1 && <Divider />}
                  </Box>
                ))}
              </Stack>

              <Divider my="md" />

              <Stack gap="xs">
                <Group justify="space-between">
                  <Text c="dimmed" fz="sm">Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</Text>
                  <Text fw={500} fz="sm">{subtotal.toLocaleString("fr-SN")} CFA</Text>
                </Group>
                <Group justify="space-between">
                  <Text c="dimmed" fz="sm">Delivery</Text>
                  <Text fz="sm" c="dimmed">Calculated on confirmation</Text>
                </Group>
              </Stack>

              <Divider my="md" />

              <Group justify="space-between">
                <Text fw={700}>Total</Text>
                <Text fw={900} fz="xl" c="orange.6">{subtotal.toLocaleString("fr-SN")} CFA</Text>
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
}
