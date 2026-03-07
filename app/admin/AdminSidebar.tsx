"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Box, Text, UnstyledButton, Stack, Collapse, Tooltip, Drawer, ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconLayoutDashboard, IconPackage, IconBoxSeam, IconShoppingBag,
  IconCategory, IconMenu2, IconChevronDown, IconChevronRight,
  IconLogout, IconExternalLink,
} from "@tabler/icons-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

/* ── Design tokens ───────────────────────────────────────── */
const BG       = "#313a46";          // Larkon sidebar dark
const BG_DARK  = "#2b3240";          // slightly darker for hover
const ACCENT   = "#f5a623";          // Afmondo orange
const MUTED    = "rgba(255,255,255,0.45)";
const NORMAL   = "rgba(255,255,255,0.72)";
const ACTIVE   = "#fff";
const SECTION  = "rgba(255,255,255,0.28)";

/* ── Nav tree ────────────────────────────────────────────── */
type NavItem = {
  icon: React.ElementType;
  label: string;
  href?: string;
  badge?: "orders";
  children?: { label: string; href: string }[];
};

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "GENERAL",
    items: [
      { icon: IconLayoutDashboard, label: "Dashboard", href: "/admin" },
      {
        icon: IconPackage, label: "Products",
        children: [
          { label: "All Products", href: "/admin/products" },
          { label: "Add New",      href: "/admin/products/new" },
        ],
      },
      { icon: IconCategory, label: "Categories", href: "/admin/categories" },
      { icon: IconBoxSeam,  label: "Inventory",  href: "/admin/inventory" },
      { icon: IconShoppingBag, label: "Orders",  href: "/admin/orders", badge: "orders" },
    ],
  },
];

/* ── Leaf nav item  ──────────────────────────────────────── */
function Leaf({ href, label, active, onClick }: { href: string; label: string; active: boolean; onClick?: () => void }) {
  return (
    <UnstyledButton
      component={Link} href={href} onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "6px 14px 6px 48px",
        borderRadius: 4, width: "100%",
        color: active ? ACCENT : MUTED,
        fontWeight: active ? 600 : 400,
        fontSize: 13, textDecoration: "none",
        transition: "color 120ms",
      }}
    >
      <Box style={{ width: 5, height: 5, borderRadius: "50%", background: active ? ACCENT : MUTED, flexShrink: 0 }} />
      {label}
    </UnstyledButton>
  );
}

/* ── Top-level nav item ──────────────────────────────────── */
function NavRow({
  item, collapsed, pendingCount, onClose,
}: { item: NavItem; collapsed: boolean; pendingCount: number; onClose?: () => void }) {
  const pathname = usePathname();
  const hasChildren = !!item.children?.length;
  const isActive = item.href
    ? (item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href))
    : item.children?.some(c => pathname.startsWith(c.href)) ?? false;
  const [open, setOpen] = useState(isActive);
  const Icon = item.icon;
  const badge = item.badge === "orders" ? pendingCount : 0;

  const rowContent = (
    <UnstyledButton
      component={(item.href && !hasChildren ? Link : "button") as any}
      href={item.href}
      onClick={() => { if (hasChildren) setOpen(v => !v); else onClose?.(); }}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: collapsed ? "11px 0" : "10px 16px",
        borderRadius: 5, width: "100%",
        color: isActive ? ACCENT : NORMAL,
        backgroundColor: isActive && !hasChildren ? "rgba(245,166,35,0.10)" : "transparent",
        textDecoration: "none", transition: "all 100ms",
      }}
    >
      <Box style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "flex-start", width: collapsed ? "100%" : "auto" }}>
        {/* Left active bar */}
        {isActive && !collapsed && (
          <Box style={{
            position: "absolute", left: 0, top: "15%", bottom: "15%",
            width: 3, background: ACCENT, borderRadius: "0 2px 2px 0",
          }} />
        )}
        <Box style={{
          width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 8,
          background: isActive ? `rgba(245,166,35,0.12)` : "rgba(255,255,255,0.04)",
          flexShrink: 0,
        }}>
          <Icon size={17} strokeWidth={isActive ? 2.2 : 1.7} />
        </Box>
        {!collapsed && (
          <Text fz={13} fw={isActive ? 600 : 400} style={{ whiteSpace: "nowrap", color: isActive ? ACCENT : NORMAL }}>
            {item.label}
          </Text>
        )}
      </Box>
      {!collapsed && (
        <Box style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {badge > 0 && (
            <Box style={{
              background: "#ef4444", color: "#fff", fontSize: 10, fontWeight: 700,
              borderRadius: 10, minWidth: 18, height: 18, padding: "0 5px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{badge}</Box>
          )}
          {hasChildren && (
            open
              ? <IconChevronDown size={13} style={{ color: MUTED }} />
              : <IconChevronRight size={13} style={{ color: MUTED }} />
          )}
        </Box>
      )}
      {collapsed && badge > 0 && (
        <Box style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: "#ef4444" }} />
      )}
    </UnstyledButton>
  );

  return (
    <Box style={{ position: "relative" }}>
      {collapsed && !hasChildren
        ? <Tooltip label={item.label} position="right" withArrow offset={12}
            styles={{ tooltip: { fontSize: 12, fontWeight: 500, background: "#1a1f2e", color: "#fff" } }}>
            {rowContent}
          </Tooltip>
        : rowContent
      }
      {!collapsed && hasChildren && (
        <Collapse in={open}>
          <Stack gap={1} mt={2}>
            {item.children!.map(child => (
              <Leaf
                key={child.href} href={child.href} label={child.label}
                active={pathname.startsWith(child.href)}
                onClick={onClose}
              />
            ))}
          </Stack>
        </Collapse>
      )}
    </Box>
  );
}

/* ── Sidebar inner ───────────────────────────────────────── */
function SidebarBody({ collapsed, onCollapse, pendingCount, onClose }: {
  collapsed: boolean; onCollapse?: () => void; pendingCount: number; onClose?: () => void;
}) {
  const router = useRouter();
  const signOut = async () => {
    const sb = createClient();
    await sb.auth.signOut();
    router.push("/account/login");
    router.refresh();
  };

  return (
    <Box style={{
      width: "100%", height: "100%",
      background: BG,
      display: "flex", flexDirection: "column",
    }}>
      {/* Logo */}
      <Box style={{
        padding: collapsed ? "18px 0" : "18px 16px",
        display: "flex", alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0, gap: 8,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          {!collapsed && (
            <>
              <Box style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
                <Image src="/logo.png" alt="" width={32} height={32} style={{ objectFit: "contain" }} />
              </Box>
              <Text fz={17} fw={800} c="white" style={{ letterSpacing: "-0.03em", lineHeight: 1 }}>
                Afmondo
              </Text>
            </>
          )}
          {collapsed && (
            <Box style={{ width: 32, height: 32, borderRadius: 8, overflow: "hidden" }}>
              <Image src="/logo.png" alt="" width={32} height={32} style={{ objectFit: "contain" }} />
            </Box>
          )}
        </Link>
        {onCollapse && (
          <ActionIcon variant="subtle" size={28} radius={6} onClick={onCollapse}
            style={{ color: MUTED, flexShrink: 0, "&:hover": { background: "rgba(255,255,255,0.05)" } }}>
            <IconChevronRight size={14} style={{ transform: collapsed ? "none" : "rotate(180deg)", transition: "transform 200ms" }} />
          </ActionIcon>
        )}
        {onClose && (
          <ActionIcon variant="subtle" size={28} radius={6} onClick={onClose} style={{ color: MUTED }}>
            <IconChevronRight size={14} />
          </ActionIcon>
        )}
      </Box>

      {/* Nav */}
      <Box style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: collapsed ? "8px 6px" : "8px 8px" }}>
        {NAV.map(group => (
          <Box key={group.section} mb="xs">
            {!collapsed && (
              <Text fz={10} fw={600} style={{ color: SECTION, letterSpacing: "0.1em", textTransform: "uppercase", padding: "12px 16px 6px" }}>
                {group.section}
              </Text>
            )}
            {collapsed && <Box style={{ height: 12 }} />}
            <Stack gap={2}>
              {group.items.map(item => (
                <NavRow key={item.label} item={item} collapsed={collapsed} pendingCount={pendingCount} onClose={onClose} />
              ))}
            </Stack>
          </Box>
        ))}
      </Box>

      {/* Sign out */}
      <Box style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: collapsed ? "10px 6px" : "10px 8px", flexShrink: 0 }}>
        {collapsed ? (
          <Tooltip label="Sign out" position="right" withArrow offset={12}>
            <UnstyledButton onClick={signOut} style={{
              width: "100%", height: 44, display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 6, color: MUTED,
            }}>
              <IconLogout size={16} strokeWidth={1.7} />
            </UnstyledButton>
          </Tooltip>
        ) : (
          <UnstyledButton onClick={signOut} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 16px", borderRadius: 6, color: MUTED, transition: "color 100ms",
          }}>
            <IconLogout size={16} strokeWidth={1.7} />
            <Text fz={13}>Sign out</Text>
          </UnstyledButton>
        )}
      </Box>
    </Box>
  );
}

/* ── Export ──────────────────────────────────────────────── */
export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const sb = createClient();
    sb.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending")
      .then(({ count }) => setPendingCount(count ?? 0));
    const ch = sb.channel("sidebar-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        sb.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending")
          .then(({ count }) => setPendingCount(count ?? 0));
      }).subscribe();
    return () => { sb.removeChannel(ch); };
  }, [mounted]);

  return (
    <>
      {/* Mobile top bar */}
      <Box hiddenFrom="md" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 300,
        height: 56, background: BG,
        display: "flex", alignItems: "center", padding: "0 16px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.35)",
      }}>
        <ActionIcon variant="subtle" size={36} radius={8} onClick={openDrawer} style={{ color: NORMAL }}>
          <IconMenu2 size={20} />
        </ActionIcon>
        <Box style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
          <Image src="/logo.png" alt="Afmondo" width={28} height={28} style={{ objectFit: "contain" }} />
          <Text fz={15} fw={800} c="white" style={{ letterSpacing: "-0.02em" }}>Afmondo</Text>
        </Box>
        {pendingCount > 0 && (
          <Link href="/admin/orders" style={{ textDecoration: "none" }}>
            <Box style={{
              background: "#ef4444", color: "#fff", fontSize: 11, fontWeight: 700,
              borderRadius: 10, minWidth: 20, height: 20, padding: "0 6px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{pendingCount}</Box>
          </Link>
        )}
      </Box>
      <Box hiddenFrom="md" style={{ height: 56, flexShrink: 0 }} />

      {/* Mobile Drawer */}
      {mounted && (
        <Drawer opened={drawerOpened} onClose={closeDrawer} size={250} withCloseButton={false} padding={0}
          styles={{ body: { padding: 0, height: "100%" }, content: { backgroundColor: BG } }}>
          <SidebarBody collapsed={false} pendingCount={pendingCount} onClose={closeDrawer} />
        </Drawer>
      )}

      {/* Desktop sidebar */}
      <Box visibleFrom="md" style={{
        width: collapsed ? 68 : 240,
        flexShrink: 0,
        transition: "width 220ms cubic-bezier(0.4,0,0.2,1)",
        position: "sticky", top: 0, height: "100vh", overflow: "hidden",
      }}>
        <SidebarBody
          collapsed={collapsed}
          onCollapse={() => setCollapsed(c => !c)}
          pendingCount={pendingCount}
        />
      </Box>
    </>
  );
}
