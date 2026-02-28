"use client";

import Link from "next/link";
import { useState } from "react";
import LanguageSwitcher from "../shared/LanguageSwitcher";
import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Anchor,
  TextInput,
  Button,
  Divider,
  Group,
  ActionIcon,
  Title,
} from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
  IconBrandLinkedin,
  IconBrandPinterest,
  IconSend,
} from "@tabler/icons-react";

const footerColumns = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/story" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Track Order", href: "/track" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const socialLinks = [
  { icon: <IconBrandFacebook size={18} />, href: "https://facebook.com/afmondo", label: "Facebook" },
  { icon: <IconBrandInstagram size={18} />, href: "https://instagram.com/afmondo", label: "Instagram" },
  { icon: <IconBrandX size={18} />, href: "https://twitter.com/afmondo", label: "Twitter" },
  { icon: <IconBrandPinterest size={18} />, href: "https://pinterest.com/afmondo", label: "Pinterest" },
  { icon: <IconBrandLinkedin size={18} />, href: "https://linkedin.com/company/afmondo", label: "LinkedIn" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log("Newsletter subscription:", email);
      setEmail("");
    }
  };

  return (
    <Box component="footer">
      {/* Main Footer */}
      <Box bg="gray.1" py={{ base: "xl", md: "2xl" }}>
        <Container size="xl">
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl" mb="xl">
            {/* Brand Column */}
            <Stack gap="md">
              <Title order={3} fw={300} fz="xl" c="dark">
                Afmondo
              </Title>
              <Text fz="sm" c="dimmed" lh={1.6}>
                Your destination for quality vehicles, electronics, furniture,
                and appliances in Senegal.
              </Text>

              {/* Social Icons */}
              <Group gap="xs">
                {socialLinks.map((link) => (
                  <ActionIcon
                    key={link.label}
                    component="a"
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="subtle"
                    color="gray"
                    size="md"
                    radius="xl"
                    aria-label={link.label}
                  >
                    {link.icon}
                  </ActionIcon>
                ))}
              </Group>
            </Stack>

            {/* Link Columns */}
            {footerColumns.map((col) => (
              <Stack key={col.title} gap="sm">
                <Text fz="xs" fw={700} tt="uppercase" c="dark" style={{ letterSpacing: 1 }}>
                  {col.title}
                </Text>
                {col.links.map((link) => (
                  <Anchor
                    key={link.label}
                    component={Link}
                    href={link.href}
                    fz="sm"
                    c="dimmed"
                    style={{
                      textDecoration: "none",
                      transition: "color 150ms",
                    }}
                    styles={{
                      root: {
                        "&:hover": { color: "var(--mantine-color-dark-7)" },
                      },
                    }}
                  >
                    {link.label}
                  </Anchor>
                ))}
              </Stack>
            ))}
          </SimpleGrid>

          {/* Newsletter */}
          <Divider mb="xl" />
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" mb="md">
            <Box>
              <Text fw={600} fz="sm" c="dark" mb="xs">
                Subscribe to our newsletter
              </Text>
              <form onSubmit={handleNewsletterSubmit}>
                <Group gap="xs">
                  <TextInput
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    required
                    style={{ flex: 1 }}
                    radius="md"
                    size="sm"
                  />
                  <Button
                    type="submit"
                    color="dark"
                    size="sm"
                    radius="md"
                    rightSection={<IconSend size={14} />}
                  >
                    Subscribe
                  </Button>
                </Group>
              </form>
              <Text fz="xs" c="dimmed" mt="xs">
                We respect your privacy. Unsubscribe at any time.
              </Text>
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Bottom Bar */}
      <Box bg="gray.2" py="sm">
        <Container size="xl">
          <Group justify="space-between" align="center" wrap="wrap" gap="sm">
            <Text fz="sm" c="dimmed">
              © {currentYear} Afmondo. All rights reserved.
            </Text>
            <LanguageSwitcher />
          </Group>
        </Container>
      </Box>
    </Box>
  );
}
