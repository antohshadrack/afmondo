"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Grid,
  Stack,
  Text,
  Title,
  TextInput,
  Textarea,
  Button,
  Paper,
  Group,
  ThemeIcon,
  Breadcrumbs,
  Anchor,
  SimpleGrid,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconChevronRight,
  IconPhone,
  IconMail,
  IconMapPin,
  IconBrandWhatsapp,
  IconCheck,
  IconSend,
  IconClock,
} from "@tabler/icons-react";
import Header from "../components/shared/header";
import Footer from "../components/sections/Footer";
import { useTranslation } from "../contexts/TranslationContext";

const contactInfo = [
  {
    icon: <IconMapPin size={20} />,
    label: "Address",
    value: "Dakar, Sénégal",
    color: "orange",
  },
  {
    icon: <IconPhone size={20} />,
    label: "Phone",
    value: "+221 77 000 00 00",
    color: "green",
    href: "tel:+221770000000",
  },
  {
    icon: <IconBrandWhatsapp size={20} />,
    label: "WhatsApp",
    value: "+221 77 000 00 00",
    color: "green",
    href: "https://wa.me/221770000000",
  },
  {
    icon: <IconMail size={20} />,
    label: "Email",
    value: "contact@afmondo.com",
    color: "blue",
    href: "mailto:contact@afmondo.com",
  },
  {
    icon: <IconClock size={20} />,
    label: "Hours",
    value: "Mon–Sat: 8am – 8pm",
    color: "violet",
  },
];

export default function ContactPage() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    validate: {
    name: (v: string) => (v.trim().length < 2 ? "Name must be at least 2 characters" : null),
      email: (v: string) => (/^\S+@\S+\.\S+$/.test(v) ? null : "Please enter a valid email"),
      message: (v: string) => (v.trim().length < 10 ? "Message must be at least 10 characters" : null),
    },
  });

  const handleSubmit = form.onSubmit(() => {
    setSubmitted(true);
    notifications.show({
      title: "Message sent!",
      message: "We'll get back to you within 24 hours.",
      color: "green",
      icon: <IconCheck size={16} />,
      autoClose: 4000,
    });
    form.reset();
    setTimeout(() => setSubmitted(false), 3000);
  });

  return (
    <Box style={{ minHeight: "100vh" }} bg="gray.0">
      <Header />

      {/* Breadcrumb */}
      <Box bg="white" style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}>
        <Container size="xl" py="sm">
          <Breadcrumbs separator={<IconChevronRight size={14} />}>
            <Anchor component={Link} href="/" fz="sm" c="dimmed">Home</Anchor>
            <Text fz="sm" fw={500} c="dark">{t("navigation.contact")}</Text>
          </Breadcrumbs>
        </Container>
      </Box>

      <Container size="xl" py={{ base: "md", md: "xl" }}>
        {/* Hero */}
        <Stack align="center" ta="center" mb="xl" gap="xs">
          <Box
            style={{
              width: 52,
              height: 4,
              borderRadius: 4,
              backgroundColor: "var(--afmondo-orange)",
              marginBottom: 8,
            }}
          />
          <Title order={1} fz={{ base: "2xl", md: "3xl" }} fw={800}>
            {t("navigation.contact")}
          </Title>
          <Text c="dimmed" maw={500}>
            Have a question or need help? We're here for you.
            Our team usually responds within a few hours.
          </Text>
        </Stack>

        <Grid gutter="xl">
          {/* ── Contact Info ─────────────────────────────── */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              {/* Info rows */}
              <Stack gap={0} style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}>
                {contactInfo.map((info) => (
                  <Box
                    key={info.label}
                    py="sm"
                    style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}
                  >
                    <Group gap="sm" wrap="nowrap" align="center">
                      <Box style={{ color: `var(--mantine-color-${info.color}-6)`, flexShrink: 0, width: 20, display: "flex", alignItems: "center" }}>
                        {info.icon}
                      </Box>
                      <Box style={{ minWidth: 0 }}>
                        <Text fz="xs" c="dimmed" tt="uppercase" style={{ letterSpacing: 0.8 }} fw={500}>
                          {info.label}
                        </Text>
                        {info.href ? (
                          <Anchor href={info.href} target="_blank" rel="noopener" fz="sm" fw={600} c="dark">
                            {info.value}
                          </Anchor>
                        ) : (
                          <Text fz="sm" fw={600}>{info.value}</Text>
                        )}
                      </Box>
                    </Group>
                  </Box>
                ))}
              </Stack>

              {/* Quick WhatsApp CTA */}
              <Button
                component="a"
                href="https://wa.me/221770000000"
                target="_blank"
                rel="noopener"
                color="green"
                leftSection={<IconBrandWhatsapp size={18} />}
                size="md"
                radius="md"
                fullWidth
              >
                Chat on WhatsApp
              </Button>
            </Stack>
          </Grid.Col>

          {/* ── Contact Form ─────────────────────────────── */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper radius="lg" shadow="sm" p={{ base: "lg", md: "xl" }}>
              <Title order={3} fw={700} mb="lg">Send us a Message</Title>
              <form onSubmit={handleSubmit}>
                <Stack gap="md">
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    <TextInput
                      label="Full Name"
                      placeholder="Your name"
                      required
                      radius="md"
                      {...form.getInputProps("name")}
                    />
                    <TextInput
                      label="Email"
                      placeholder="your@email.com"
                      required
                      radius="md"
                      {...form.getInputProps("email")}
                    />
                  </SimpleGrid>

                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    <TextInput
                      label="Phone (optional)"
                      placeholder="+221 77 000 0000"
                      radius="md"
                      {...form.getInputProps("phone")}
                    />
                    <Select
                      label="Subject"
                      placeholder="Select a topic"
                      radius="md"
                      data={[
                        "General Inquiry",
                        "Order Support",
                        "Product Question",
                        "Returns & Refunds",
                        "Partnership",
                        "Other",
                      ]}
                      {...form.getInputProps("subject")}
                    />
                  </SimpleGrid>

                  <Textarea
                    label="Message"
                    placeholder="Tell us how we can help..."
                    required
                    minRows={5}
                    radius="md"
                    {...form.getInputProps("message")}
                  />

                  <Button
                    type="submit"
                    color={submitted ? "green" : "orange"}
                    size="md"
                    radius="md"
                    leftSection={submitted ? <IconCheck size={18} /> : <IconSend size={18} />}
                    style={{ alignSelf: "flex-start" }}
                    miw={160}
                  >
                    {submitted ? "Sent!" : "Send Message"}
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
}
