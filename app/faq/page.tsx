"use client";

import { useState } from "react";
import Header from "../components/shared/header";
import Footer from "../components/sections/Footer";
import {
  Box, Container, Title, Text, Stack, Accordion,
  Group, ThemeIcon, Input, SimpleGrid,
} from "@mantine/core";
import { IconSearch, IconPackage, IconTruck, IconRefresh, IconCreditCard, IconHeadset, IconShieldCheck } from "@tabler/icons-react";

const faqCategories = [
  {
    icon: <IconPackage size={18} />,
    label: "Orders",
    color: "orange",
    faqs: [
      { q: "How do I place an order?", a: "Browse the product you want, click 'Add to Cart', then proceed to checkout. You can pay via mobile money, bank transfer, or cash on delivery." },
      { q: "Can I modify my order after placing it?", a: "You can modify or cancel your order within 1 hour of placing it by contacting our support team via WhatsApp or phone." },
      { q: "How do I track my order?", a: "Once your order is confirmed, you'll receive an SMS with your tracking number. You can also track it on our Track Order page." },
    ],
  },
  {
    icon: <IconTruck size={18} />,
    label: "Shipping & Delivery",
    color: "green",
    faqs: [
      { q: "Which cities do you deliver to?", a: "We deliver to all major cities in Senegal including Dakar, Thiès, Saint-Louis, Ziguinchor, Kaolack, and Tambacounda. Remote areas may have extended delivery times." },
      { q: "How long does delivery take?", a: "Standard delivery within Dakar takes 1–2 business days. Delivery to other regions takes 3–5 business days depending on the destination." },
      { q: "Is delivery free?", a: "Delivery is free for orders above 50,000 CFA within Dakar. A delivery fee applies for smaller orders and deliveries outside Dakar." },
    ],
  },
  {
    icon: <IconRefresh size={18} />,
    label: "Returns & Refunds",
    color: "orange",
    faqs: [
      { q: "What is your return policy?", a: "We offer a 7-day return policy on all products. The item must be in its original condition with all packaging and accessories." },
      { q: "How do I initiate a return?", a: "Contact our team via WhatsApp (+221 77 000 0000) or email within 7 days of delivery. We'll arrange a pickup at no extra cost." },
      { q: "When will I receive my refund?", a: "Once we receive and inspect the returned item, your refund will be processed within 3–5 business days to your original payment method." },
    ],
  },
  {
    icon: <IconCreditCard size={18} />,
    label: "Payments",
    color: "green",
    faqs: [
      { q: "What payment methods do you accept?", a: "We accept Orange Money, Wave, Free Money, bank transfer, and cash on delivery for eligible orders." },
      { q: "Is it safe to pay online?", a: "Yes. All online transactions are encrypted and processed through secure payment gateways. We never store your card or mobile money details." },
      { q: "Can I pay in instalments?", a: "Instalment payment options are available for certain high-value products. Look for the 'Pay in instalments' badge on eligible listings." },
    ],
  },
  {
    icon: <IconShieldCheck size={18} />,
    label: "Warranties & Authenticity",
    color: "orange",
    faqs: [
      { q: "Are your products genuine?", a: "Yes. Every product on Afmondo is sourced from verified manufacturers or authorised distributors. We do not sell counterfeit goods." },
      { q: "Do products come with a warranty?", a: "Yes. All products include the manufacturer's warranty. The warranty period varies by product and is displayed on each product page." },
      { q: "How do I claim warranty?", a: "Contact our support team with your order number and a description of the issue. We'll coordinate with the manufacturer on your behalf." },
    ],
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");

  const filtered = faqCategories.map((cat) => ({
    ...cat,
    faqs: cat.faqs.filter(
      (f) =>
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.faqs.length > 0);

  return (
    <Box>
      <Header />

      {/* Hero */}
      <Box bg="dark.8" py={{ base: 60, md: 80 }} style={{ borderBottom: "3px solid var(--afmondo-orange)" }}>
        <Container size="md" ta="center">
          <Text fz="xs" fw={600} tt="uppercase" c="orange.4" style={{ letterSpacing: 2 }} mb={10}>
            Help Center
          </Text>
          <Title order={1} c="white" fw={800} fz={{ base: "2xl", md: "4xl" }} lh={1.15} mb="lg">
            Frequently Asked Questions
          </Title>
          {/* Search */}
          <Input
            size="lg"
            radius="md"
            placeholder="Search questions..."
            leftSection={<IconSearch size={18} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            maw={520}
            mx="auto"
            styles={{ input: { backgroundColor: "rgba(255,255,255,0.1)", color: "white", "::placeholder": { color: "rgba(255,255,255,0.4)" } } }}
          />
        </Container>
      </Box>

      {/* FAQ categories */}
      <Box py={{ base: "xl", md: 80 }} bg="white">
        <Container size="md">
          {filtered.length === 0 ? (
            <Stack align="center" py={60} gap="sm">
              <IconHeadset size={40} color="var(--mantine-color-gray-4)" />
              <Text c="dimmed">No results found. Try a different search or contact support.</Text>
            </Stack>
          ) : (
            <Stack gap="xl">
              {filtered.map((cat) => (
                <Box key={cat.label}>
                  <Group gap="sm" mb="md">
                    <Box style={{ color: `var(--mantine-color-${cat.color}-6)` }}>{cat.icon}</Box>
                    <Text fw={700} fz="md">{cat.label}</Text>
                  </Group>
                  <Accordion variant="separated" radius="md">
                    {cat.faqs.map((faq) => (
                      <Accordion.Item key={faq.q} value={faq.q}>
                        <Accordion.Control>
                          <Text fz="sm" fw={500}>{faq.q}</Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Text fz="sm" c="dimmed" lh={1.8}>{faq.a}</Text>
                        </Accordion.Panel>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Box>
              ))}
            </Stack>
          )}
        </Container>
      </Box>

      {/* Still need help */}
      <Box py={{ base: "xl", md: 60 }} bg="gray.0" style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}>
        <Container size="sm" ta="center">
          <ThemeIcon size={52} radius="xl" color="orange" variant="light" mx="auto" mb="md">
            <IconHeadset size={26} />
          </ThemeIcon>
          <Title order={3} fw={700} mb="xs">Still need help?</Title>
          <Text c="dimmed" fz="sm" mb="lg">Our team is available 8am – 6pm, Monday to Saturday.</Text>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" maw={360} mx="auto">
            <Box style={{ border: "1px solid var(--mantine-color-gray-3)", borderRadius: 8, padding: "12px 16px" }}>
              <Text fz="xs" c="dimmed" mb={2}>WhatsApp</Text>
              <Text fw={600} fz="sm">+221 77 000 0000</Text>
            </Box>
            <Box style={{ border: "1px solid var(--mantine-color-gray-3)", borderRadius: 8, padding: "12px 16px" }}>
              <Text fz="xs" c="dimmed" mb={2}>Email</Text>
              <Text fw={600} fz="sm">support@afmondo.com</Text>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
