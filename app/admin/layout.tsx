"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Box, Text, UnstyledButton, Stack, Group, Divider } from "@mantine/core";
import {
  IconLayoutDashboard, IconPackage, IconBoxSeam,
  IconShoppingBag, IconLogout, IconChevronRight,
} from "@tabler/icons-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { icon: <IconLayoutDashboard size={18} />, label: "Dashboard", href: "/admin" },
  { icon: <IconPackage size={18} />, label: "Products", href: "/admin/products" },
  { icon: <IconBoxSeam size={18} />, label: "Inventory", href: "/admin/inventory" },
  { icon: <IconShoppingBag size={18} />, label: "Orders", href: "/admin/orders" },
];

function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/account/login");
  };

  return (
    <Box
      style={{
        width: 220,
        flexShrink: 0,
        backgroundColor: "var(--mantine-color-dark-8)",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Orange accent */}
      <Box style={{ height: 3, backgroundColor: "var(--afmondo-orange)" }} />

      {/* Logo */}
      <Box px="md" py="lg" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" style={{ display: "inline-block" }}>
          <Image src="/logo.png" alt="Afmondo" width={110} height={36} style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
        </Link>
        <Text fz="xs" c="rgba(255,255,255,0.35)" mt={4} style={{ letterSpacing: 1 }}>ADMIN</Text>
      </Box>

      {/* Nav */}
      <Stack gap={2} p="sm" style={{ flex: 1 }}>
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <UnstyledButton
              key={item.href}
              component={Link}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 12px",
                borderRadius: 6,
                backgroundColor: active ? "rgba(245,166,35,0.12)" : "transparent",
                color: active ? "var(--afmondo-orange)" : "rgba(255,255,255,0.6)",
                transition: "all 120ms",
                textDecoration: "none",
              }}
            >
              <Group gap="sm">
                {item.icon}
                <Text fz="sm" fw={active ? 600 : 400}>{item.label}</Text>
              </Group>
              {active && <IconChevronRight size={13} />}
            </UnstyledButton>
          );
        })}
      </Stack>

      {/* Sign out */}
      <Box p="sm" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <UnstyledButton
          onClick={handleSignOut}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 6, color: "rgba(255,255,255,0.4)", width: "100%" }}
        >
          <IconLogout size={16} />
          <Text fz="sm">Sign out</Text>
        </UnstyledButton>
      </Box>
    </Box>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--mantine-color-gray-0)" }}>
      <Sidebar />
      <Box style={{ flex: 1, overflow: "auto" }}>
        {children}
      </Box>
    </Box>
  );
}
