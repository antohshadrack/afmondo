"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AppShell,
  Burger,
  Group,
  Text,
  TextInput,
  ActionIcon,
  Indicator,
  Menu,
  NavLink,
  Drawer,
  ScrollArea,
  Divider,
  Box,
  Collapse,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconSearch,
  IconShoppingCart,
  IconUser,
  IconChevronDown,
  IconChevronRight,
  IconDoorExit,
  IconPackage
} from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "../../contexts/TranslationContext";
import { useCart } from "../../contexts/CartContext";

interface MenuSubItem {
  title: string;
  href: string;
  badge?: { text: string; color: string };
}

interface MenuSection {
  title: string;
  items: MenuSubItem[];
}

interface MenuItem {
  label: string;
  href: string;
  submenu?: MenuSection[];
}

const getNavigationMenu = (t: (key: string) => string): MenuItem[] => [
  { label: t("navigation.home"), href: "/" },
  {
    label: t("navigation.vehicles"),
    href: "/vehicles",
    submenu: [
      {
        title: t("navigation.automobiles"),
        items: [
          { title: t("navigation.cars"), href: "/vehicles/cars" },
          { title: t("navigation.suvsTrucks"), href: "/vehicles/suvs-trucks" },
          { title: t("navigation.vansBuses"), href: "/vehicles/vans-buses" },
        ],
      },
      {
        title: t("navigation.agricultural"),
        items: [
          { title: t("navigation.tractors"), href: "/vehicles/tractors" },
          { title: t("navigation.harvesters"), href: "/vehicles/harvesters" },
          { title: t("navigation.farmEquipment"), href: "/vehicles/farm-equipment" },
        ],
      },
      {
        title: t("navigation.partsAccessories"),
        items: [
          { title: t("navigation.vehicleParts"), href: "/vehicles/parts" },
          { title: t("navigation.tractorParts"), href: "/vehicles/tractor-parts" },
        ],
      },
    ],
  },
  {
    label: t("navigation.electronics"),
    href: "/electronics",
    submenu: [
      {
        title: t("navigation.entertainment"),
        items: [
          { title: t("navigation.televisions"), href: "/electronics/tvs" },
          { title: t("navigation.smartTVs"), href: "/electronics/smart-tvs" },
          { title: t("navigation.homeTheater"), href: "/electronics/home-theater" },
        ],
      },
      {
        title: t("navigation.officeEquipment"),
        items: [
          { title: t("navigation.printingMachines"), href: "/electronics/printing-machines" },
          { title: t("navigation.printersScanners"), href: "/electronics/printers" },
          { title: t("navigation.copiers"), href: "/electronics/copiers" },
        ],
      },
    ],
  },
  {
    label: t("navigation.furniture"),
    href: "/furniture",
    submenu: [
      {
        title: t("navigation.livingRoom"),
        items: [
          { title: t("navigation.sofasCouches"), href: "/furniture/sofas" },
          { title: t("navigation.coffeeTablesTVStands"), href: "/furniture/coffee-tables" },
        ],
      },
      {
        title: t("navigation.bedroom"),
        items: [
          { title: t("navigation.beds"), href: "/furniture/beds" },
          { title: t("navigation.dressersWardrobes"), href: "/furniture/wardrobes" },
        ],
      },
    ],
  },
  {
    label: t("navigation.appliances"),
    href: "/appliances",
    submenu: [
      {
        title: t("navigation.kitchen"),
        items: [
          { title: t("navigation.refrigerators"), href: "/appliances/refrigerators" },
          { title: t("navigation.microwaves"), href: "/appliances/microwaves" },
          { title: t("navigation.ovens"), href: "/appliances/ovens" },
        ],
      },
      {
        title: t("navigation.laundry"),
        items: [
          { title: t("navigation.washingMachines"), href: "/appliances/washing-machines" },
          { title: t("navigation.dryers"), href: "/appliances/dryers" },
        ],
      },
    ],
  },
  {
    label: t("navigation.machinery"),
    href: "/machinery",
    submenu: [
      {
        title: t("navigation.industrial"),
        items: [
          { title: t("navigation.generators"), href: "/machinery/generators" },
          { title: t("navigation.compressors"), href: "/machinery/compressors" },
        ],
      },
      {
        title: t("navigation.construction"),
        items: [
          { title: t("navigation.excavators"), href: "/machinery/excavators" },
          { title: t("navigation.cranes"), href: "/machinery/cranes" },
        ],
      },
    ],
  },
  { label: t("navigation.contact"), href: "/contact" },
];

function MobileNavItem({ item }: { item: MenuItem }) {
  const [opened, { toggle }] = useDisclosure(false);
  return (
    <>
      {item.submenu ? (
        <NavLink
          component="button"
          label={item.label}
          rightSection={
            <IconChevronDown
              size={16}
              style={{
                transform: opened ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 200ms ease",
              }}
            />
          }
          onClick={toggle}
          fw={500}
        />
      ) : (
        <NavLink
          component={Link}
          href={item.href}
          label={item.label}
          fw={500}
        />
      )}
      {item.submenu && (
        <Collapse in={opened}>
          {item.submenu.map((section) =>
            section.items.map((sub) => (
              <NavLink
                key={sub.href}
                component={Link}
                href={sub.href}
                label={sub.title}
                pl="xl"
                fz="sm"
                c="dimmed"
              />
            ))
          )}
        </Collapse>
      )}
    </>
  );
}

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { getCartCount } = useCart();
  const router = useRouter();
  const navMenu = getNavigationMenu(t);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [searchOpened, { toggle: toggleSearch }] = useDisclosure(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartCount = getCartCount();
  const supabase = createClient();
  const [userLogged, setUserLogged] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserLogged(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserLogged(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); // Refresh the page to reflect signed out state globally
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      toggleSearch();
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="xs"
        title={
          <Link href="/" onClick={closeDrawer}>
            <img src="/logo.jpeg" alt="Afmondo" style={{ height: 48 }} />
          </Link>
        }
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {navMenu.map((item, idx) => (
          <MobileNavItem key={idx} item={item} />
        ))}
        <Divider my="sm" />
        {userLogged ? (
          <>
            <NavLink
              component={Link}
              href="/account/profile"
              label="My Profile"
              leftSection={<IconUser size={18} />}
              onClick={closeDrawer}
            />
            <NavLink
              component={Link}
              href="/account/orders"
              label="My Orders"
              leftSection={<IconPackage size={18} />}
              onClick={closeDrawer}
            />
            <NavLink
              component="button"
              label="Log Out"
              leftSection={<IconDoorExit size={18} />}
              onClick={() => { handleLogout(); closeDrawer(); }}
              color="red"
            />
          </>
        ) : (
          <NavLink
            component={Link}
            href="/account/login"
            label="Log In / Register"
            leftSection={<IconUser size={18} />}
            onClick={closeDrawer}
          />
        )}
      </Drawer>

      {/* Header */}
      <Box
        component="header"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 200,
          backgroundColor: "white",
          borderBottom: "1px solid var(--mantine-color-gray-2)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        {/* Top bar */}
        <Box
          px={{ base: "md", lg: "xl" }}
          py={{ base: "xs", lg: "sm" }}
          maw={1400}
          mx="auto"
        >
          <Group justify="space-between" align="center">
            {/* Left: Burger (mobile) + Logo */}
            <Group gap="sm">
              <Burger
                opened={drawerOpened}
                onClick={toggleDrawer}
                hiddenFrom="lg"
                size="sm"
                aria-label="Toggle navigation"
              />
              <Link href="/">
                <img
                  src="/logo.jpeg"
                  alt="Afmondo Logo"
                  style={{ height: 56, width: "auto" }}
                />
              </Link>
            </Group>

            {/* Center: Desktop nav */}
            <Group gap={4} visibleFrom="lg">
              {navMenu.map((item, idx) =>
                item.submenu ? (
                  <Menu
                    key={idx}
                    trigger="hover"
                    openDelay={50}
                    closeDelay={120}
                    width={720}
                    shadow="md"
                    position="bottom-start"
                    offset={8}
                  >
                    <Menu.Target>
                      <UnstyledButton
                        component={Link}
                        href={item.href}
                        style={{
                          padding: "8px 12px",
                          borderRadius: 6,
                          fontWeight: 500,
                          fontSize: 14,
                          color: "var(--mantine-color-dark-7)",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          whiteSpace: "nowrap",
                        }}
                        className="header-nav-link"
                      >
                        {item.label}
                        <IconChevronDown size={14} />
                      </UnstyledButton>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Box p="md">
                        <Group align="flex-start" gap="xl" wrap="nowrap">
                          {item.submenu.map((section, sIdx) => (
                            <Box key={sIdx} miw={160}>
                              <Text fw={600} fz="xs" tt="uppercase" c="dimmed" mb="xs">
                                {section.title}
                              </Text>
                              {section.items.map((sub) => (
                                <Menu.Item
                                  key={sub.href}
                                  component={Link}
                                  href={sub.href}
                                  fz="sm"
                                >
                                  {sub.title}
                                </Menu.Item>
                              ))}
                            </Box>
                          ))}
                        </Group>
                      </Box>
                    </Menu.Dropdown>
                  </Menu>
                ) : (
                  <UnstyledButton
                    key={idx}
                    component={Link}
                    href={item.href}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      fontWeight: 500,
                      fontSize: 14,
                      color: "var(--mantine-color-dark-7)",
                    }}
                  >
                    {item.label}
                  </UnstyledButton>
                )
              )}
            </Group>

            {/* Right: Search + Account + Cart */}
            <Group gap="xs">
              <ActionIcon
                variant="subtle"
                color="dark"
                size="lg"
                onClick={toggleSearch}
                aria-label="Search"
              >
                <IconSearch size={20} />
              </ActionIcon>
              {userLogged ? (
                <Menu shadow="md" width={200} position="bottom-end">
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="dark" size="lg" visibleFrom="lg" aria-label="Account menu">
                      <IconUser size={20} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item leftSection={<IconUser size={14} />} component={Link} href="/account/profile">
                      Profile
                    </Menu.Item>
                    <Menu.Item leftSection={<IconPackage size={14} />} component={Link} href="/account/orders">
                      My Orders
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item color="red" leftSection={<IconDoorExit size={14} />} onClick={handleLogout}>
                      Sign out
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <ActionIcon
                  variant="subtle"
                  color="dark"
                  size="lg"
                  component={Link}
                  href="/account/login"
                  aria-label="Login"
                  visibleFrom="lg"
                >
                  <IconUser size={20} />
                </ActionIcon>
              )}
              <Indicator
                label={cartCount}
                size={18}
                disabled={cartCount === 0}
                color="red"
                processing={cartCount > 0}
              >
                <ActionIcon
                  variant="subtle"
                  color="dark"
                  size="lg"
                  component={Link}
                  href="/cart"
                  aria-label="Shopping cart"
                >
                  <IconShoppingCart size={20} />
                </ActionIcon>
              </Indicator>
            </Group>
          </Group>

          {/* Search Bar (expandable) */}
          <Collapse in={searchOpened}>
            <Box pt="sm" pb="xs">
              <form onSubmit={handleSearch}>
                <TextInput
                  placeholder={t("navigation.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                  autoFocus={searchOpened}
                  rightSection={
                    <ActionIcon type="submit" color="orange" variant="filled">
                      <IconSearch size={16} />
                    </ActionIcon>
                  }
                  styles={{ input: { fontSize: 14 } }}
                />
              </form>
            </Box>
          </Collapse>
        </Box>
      </Box>

      <style>{`
        .header-nav-link:hover {
          background: var(--mantine-color-orange-0);
          color: var(--mantine-color-orange-6);
        }
      `}</style>
    </>
  );
};

export default Header;
