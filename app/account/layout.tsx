"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Container, Grid, Text, UnstyledButton, Stack, Group, Paper } from "@mantine/core";
import {
  IconUser, IconPackage, IconSettings, IconChevronRight, IconDoorExit
} from "@tabler/icons-react";
import Header from "../components/shared/header";
import Footer from "../components/sections/Footer";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { icon: <IconUser size={18} />, label: "My Profile", href: "/account/profile" },
  { icon: <IconPackage size={18} />, label: "My Orders", href: "/account/orders" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const supabase = createClient();

  // If we are on the login page (or auth callback), do not show the account sidebar layout
  if (pathname === "/account/login" || pathname === "/account/register" || pathname.startsWith("/auth/")) {
    return <>{children}</>;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <Box style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }} bg="gray.0">
      <Header />
      
      <Container size="xl" py="xl" style={{ flex: 1, width: "100%" }}>
        <Text fz="xs" tt="uppercase" fw={700} c="dimmed" mb="xs">My Account</Text>
        <Text fz="h2" fw={800} mb="xl">Welcome Back</Text>

        <Grid gutter="xl">
          {/* Sidebar */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Paper withBorder radius="md" p="sm" bg="white">
              <Stack gap={4}>
                {navItems.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <UnstyledButton
                      key={item.href}
                      component={Link}
                      href={item.href}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 12px",
                        borderRadius: 6,
                        backgroundColor: active ? "var(--mantine-color-orange-0)" : "transparent",
                        color: active ? "var(--mantine-color-orange-6)" : "var(--mantine-color-dark-6)",
                        fontWeight: active ? 600 : 400,
                        transition: "all 150ms",
                      }}
                    >
                      <Group gap="sm">
                        {item.icon}
                        <Text fz="sm">{item.label}</Text>
                      </Group>
                      {active && <IconChevronRight size={14} />}
                    </UnstyledButton>
                  );
                })}
              </Stack>
              
              <Box mt="md" pt="sm" style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}>
                 <UnstyledButton
                  onClick={handleSignOut}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 12px",
                    borderRadius: 6,
                    color: "var(--mantine-color-red-6)",
                    width: "100%",
                    transition: "all 150ms",
                  }}
                 >
                    <Group gap="sm">
                      <IconDoorExit size={18} />
                      <Text fz="sm" fw={500}>Sign Out</Text>
                    </Group>
                 </UnstyledButton>
              </Box>
            </Paper>
          </Grid.Col>

          {/* Main Content Area */}
          <Grid.Col span={{ base: 12, md: 9 }}>
            {children}
          </Grid.Col>
        </Grid>
      </Container>
      
      <Footer />
    </Box>
  );
}
