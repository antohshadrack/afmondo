"use client";

import { usePathname } from "next/navigation";
import {
  Box, Text, Group, Avatar, TextInput, ActionIcon, Tooltip,
  Popover, Stack, Badge, ScrollArea, Divider, UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications as mantineNotifications } from "@mantine/notifications";
import {
  IconSearch, IconBell, IconExternalLink, IconShoppingBag,
  IconPackage, IconCheck, IconX,
} from "@tabler/icons-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useRef, useCallback } from "react";

/* ── Types ───────────────────────────────────────────────── */
type NotifType = "order" | "product_update" | "product_new";

interface AdminNotif {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: Date;
  read: boolean;
  href: string;
}

/* ── Page labels ─────────────────────────────────────────── */
const PAGE_LABELS: Record<string, string> = {
  "/admin":              "DASHBOARD",
  "/admin/products":     "PRODUCT LIST",
  "/admin/products/new": "ADD PRODUCT",
  "/admin/categories":   "CATEGORIES",
  "/admin/inventory":    "INVENTORY",
  "/admin/orders":       "ORDERS",
};

function getLabel(pathname: string) {
  if (PAGE_LABELS[pathname]) return PAGE_LABELS[pathname];
  if (pathname.includes("/edit")) return "EDIT PRODUCT";
  return "ADMIN";
}

function timeAgo(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

/* ── Notification icon by type ───────────────────────────── */
function NotifIcon({ type }: { type: NotifType }) {
  const map: Record<NotifType, { icon: React.ReactNode; bg: string; color: string }> = {
    order:          { icon: <IconShoppingBag size={14} />, bg: "#fff3e0", color: "#f5a623" },
    product_update: { icon: <IconPackage size={14} />,    bg: "#eff6ff", color: "#3b82f6" },
    product_new:    { icon: <IconPackage size={14} />,    bg: "#ecfdf5", color: "#10b981" },
  };
  const m = map[type];
  return (
    <Box style={{
      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
      background: m.bg, color: m.color,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>{m.icon}</Box>
  );
}

/* ── Main component ──────────────────────────────────────── */
export default function AdminTopBar({ email }: { email: string }) {
  const pathname = usePathname();
  const label = getLabel(pathname);
  const initials = email ? email[0].toUpperCase() : "A";
  const [bellOpen, { toggle: toggleBell, close: closeBell }] = useDisclosure(false);
  const [notifs, setNotifs] = useState<AdminNotif[]>([]);
  const [mounted, setMounted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const unread = notifs.filter(n => !n.read).length;

  useEffect(() => { 
    setMounted(true);
    // Request desktop notification permissions
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    
    // Initialize AudioContext but keep it suspended
    // We unlock it on the first user interaction
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    } catch {}

    const unlockAudio = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);
    window.addEventListener("keydown", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  /* Play a pleasant 2-note chime (Ding-Dong) */
  const playChime = useCallback(() => {
    try {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume();

      const playNote = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = "sine";
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      playNote(523.25, now, 0.4);       // C5
      playNote(659.25, now + 0.15, 0.6); // E5
    } catch (err) {
      console.warn("Could not play audio chime", err);
    }
  }, []);

  const addNotif = useCallback((n: Omit<AdminNotif, "id" | "time" | "read">) => {
    const notif: AdminNotif = { ...n, id: crypto.randomUUID(), time: new Date(), read: false };
    setNotifs(prev => [notif, ...prev].slice(0, 30));
    playChime();

    /* Browser System Notification */
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notif.title, { body: notif.body, icon: "/icon.png" });
    }

    /* Toast using Mantine notifications */
    mantineNotifications.show({
      id: notif.id,
      title: notif.title,
      message: notif.body,
      color: notif.type === "order" ? "orange" : notif.type === "product_new" ? "green" : "blue",
      icon: notif.type === "order" ? <IconShoppingBag size={16} /> : <IconPackage size={16} />,
      autoClose: 6000,
    });
  }, [playChime]);

  /* ── Supabase Realtime subscriptions ──────────────────── */
  useEffect(() => {
    if (!mounted) return;
    const sb = createClient();

    /* New order */
    const orderCh = sb.channel("admin-orders-notif")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload) => {
        const row = payload.new as any;
        addNotif({
          type: "order",
          title: "New Order Received!",
          body: `${row.delivery_name ?? "A customer"} placed an order — ${Number(row.total).toLocaleString("fr-SN")} CFA`,
          href: "/admin/orders",
        });
      })
      .subscribe();

    /* Product changed */
    const productCh = sb.channel("admin-products-notif")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "products" }, (payload) => {
        const row = payload.new as any;
        addNotif({
          type: "product_new",
          title: "New Product Added",
          body: `"${row.name}" was added${row.price ? ` — ${Number(row.price).toLocaleString("fr-SN")} CFA` : ""}`,
          href: "/admin/products",
        });
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "products" }, (payload) => {
        const row = payload.new as any;
        addNotif({
          type: "product_update",
          title: "Product Updated",
          body: `"${row.name}" was modified`,
          href: `/admin/products/${row.id}/edit`,
        });
      })
      .subscribe();

    return () => { sb.removeChannel(orderCh); sb.removeChannel(productCh); };
  }, [mounted, addNotif]);

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const clearAll    = () => setNotifs([]);

  return (
    <Box
      visibleFrom="md"
      style={{
        height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #f1f3f5",
        flexShrink: 0, position: "sticky", top: 0, zIndex: 200,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Page title */}
      <Text fz={13} fw={700} style={{ color: "#4b5563", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {label}
      </Text>

      {/* Right actions */}
      <Group gap={8} align="center">
        {/* Search */}
        <TextInput
          placeholder="Search…" size="xs" radius="md"
          leftSection={<IconSearch size={13} color="#aaa" />}
          styles={{ input: { border: "1px solid #e9ecef", backgroundColor: "#f8f9fa", color: "#444", width: 180, fontSize: 12 } }}
        />

        {/* View storefront */}
        <Tooltip label="View storefront" withArrow>
          <ActionIcon component={Link} href="/" target="_blank" variant="subtle" size={34} radius={8}
            style={{ backgroundColor: "#f8f9fa", color: "#888" }}>
            <IconExternalLink size={15} />
          </ActionIcon>
        </Tooltip>

        {/* ── Bell with notifications ──────────────── */}
        {mounted && (
          <Popover opened={bellOpen} onClose={closeBell} position="bottom-end" offset={8} width={340} shadow="lg" radius="md">
            <Popover.Target>
              <Tooltip label="Notifications" withArrow>
                <ActionIcon
                  onClick={toggleBell} variant="subtle" size={34} radius={8}
                  style={{ backgroundColor: "#f8f9fa", color: unread > 0 ? "#f5a623" : "#888", position: "relative" }}
                >
                  <IconBell size={17} />
                  {unread > 0 && (
                    <Box style={{
                      position: "absolute", top: 4, right: 4,
                      width: 14, height: 14, borderRadius: "50%",
                      background: "#ef4444", border: "2px solid #fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 8, fontWeight: 800, color: "#fff",
                    }}>{unread > 9 ? "9+" : unread}</Box>
                  )}
                </ActionIcon>
              </Tooltip>
            </Popover.Target>

            <Popover.Dropdown p={0} style={{ border: "1px solid #f1f3f5" }}>
              {/* Popover header */}
              <Group justify="space-between" px="md" py="sm" style={{ borderBottom: "1px solid #f3f4f6" }}>
                <Group gap={6}>
                  <Text fw={700} fz={13} c="#111">Notifications</Text>
                  {unread > 0 && (
                    <Badge size="xs" color="red" variant="filled" radius="xl">{unread}</Badge>
                  )}
                </Group>
                <Group gap={4}>
                  {unread > 0 && (
                    <Tooltip label="Mark all read" withArrow>
                      <ActionIcon variant="subtle" size={24} onClick={markAllRead} color="green">
                        <IconCheck size={13} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                  {notifs.length > 0 && (
                    <Tooltip label="Clear all" withArrow>
                      <ActionIcon variant="subtle" size={24} onClick={clearAll} color="gray">
                        <IconX size={13} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>
              </Group>

              {/* Notification list */}
              {notifs.length === 0
                ? <Box py="xl" style={{ textAlign: "center" }}>
                    <IconBell size={28} color="#ddd" />
                    <Text fz={12} c="#9ca3af" mt={8}>No notifications yet.</Text>
                    <Text fz={11} c="#c4c9d0">New orders and product changes<br/>will appear here in real-time.</Text>
                  </Box>
                : <ScrollArea.Autosize mah={360}>
                    <Stack gap={0}>
                      {notifs.map((n, i) => (
                        <UnstyledButton
                          key={n.id}
                          component={Link}
                          href={n.href}
                          onClick={() => {
                            setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
                            closeBell();
                          }}
                          style={{
                            display: "flex", alignItems: "flex-start", gap: 10,
                            padding: "10px 14px",
                            background: n.read ? "#fff" : "#fffbf3",
                            borderBottom: i < notifs.length - 1 ? "1px solid #f3f4f6" : undefined,
                            transition: "background 100ms",
                          }}
                        >
                          <NotifIcon type={n.type} />
                          <Box style={{ flex: 1, minWidth: 0 }}>
                            <Group justify="space-between" gap={4} mb={2}>
                              <Text fz={12} fw={600} c="#222" lineClamp={1}>{n.title}</Text>
                              {!n.read && <Box style={{ width: 6, height: 6, borderRadius: "50%", background: "#f5a623", flexShrink: 0 }} />}
                            </Group>
                            <Text fz={11} c="#6b7280" lineClamp={2}>{n.body}</Text>
                            <Text fz={10} c="#9ca3af" mt={3}>{timeAgo(n.time)}</Text>
                          </Box>
                        </UnstyledButton>
                      ))}
                    </Stack>
                  </ScrollArea.Autosize>
              }

              {notifs.length > 0 && (
                <>
                  <Divider color="#f3f4f6" />
                  <Box py="xs" ta="center">
                    <Text fz={11} c="#9ca3af">{notifs.length} notification{notifs.length > 1 ? "s" : ""} this session</Text>
                  </Box>
                </>
              )}
            </Popover.Dropdown>
          </Popover>
        )}

        {/* Divider */}
        <Box style={{ width: 1, height: 24, background: "#e9ecef" }} />

        {/* User chip */}
        <Group gap={8} align="center" style={{ padding: "5px 12px 5px 8px", borderRadius: 20, border: "1px solid #e9ecef", backgroundColor: "#f8f9fa" }}>
          <Avatar size={26} radius="xl" color="orange" fw={700} fz={11}>{initials}</Avatar>
          <Box>
            <Text fz={12} fw={600} c="#333" lineClamp={1} style={{ maxWidth: 150 }}>{email}</Text>
            <Text fz={10} c="#aaa">Administrator</Text>
          </Box>
        </Group>
      </Group>
    </Box>
  );
}
