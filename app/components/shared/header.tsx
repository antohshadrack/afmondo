"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "@deemlol/next-icons";
import { Search } from "@deemlol/next-icons";
import { User } from "@deemlol/next-icons";
import { ChevronDown, Menu, X } from "lucide-react";
import { useTranslation } from '../../contexts/TranslationContext';
import { useCart } from '../../contexts/CartContext';
interface MenuSubItem {
  title: string;
  href: string;
  badge?: {
    text: string;
    color: string;
  };
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
  {
    label: t('navigation.home'),
    href: "/",
  },
  {
    label: t('navigation.vehicles'),
    href: "/vehicles",
    submenu: [
      {
        title: t('navigation.automobiles'),
        items: [
          { title: t('navigation.cars'), href: "/vehicles/cars" },
          { title: t('navigation.suvsTrucks'), href: "/vehicles/suvs-trucks" },
          { title: t('navigation.vansBuses'), href: "/vehicles/vans-buses" },
        ],
      },
      {
        title: t('navigation.agricultural'),
        items: [
          { title: t('navigation.tractors'), href: "/vehicles/tractors" },
          { title: t('navigation.harvesters'), href: "/vehicles/harvesters" },
          { title: t('navigation.farmEquipment'), href: "/vehicles/farm-equipment" },
        ],
      },
      {
        title: t('navigation.partsAccessories'),
        items: [
          { title: t('navigation.vehicleParts'), href: "/vehicles/parts" },
          { title: t('navigation.tractorParts'), href: "/vehicles/tractor-parts" },
        ],
      },
    ],
  },
  {
    label: t('navigation.electronics'),
    href: "/electronics",
    submenu: [
      {
        title: t('navigation.entertainment'),
        items: [
          { title: t('navigation.televisions'), href: "/electronics/tvs" },
          { title: t('navigation.smartTVs'), href: "/electronics/smart-tvs" },
          { title: t('navigation.homeTheater'), href: "/electronics/home-theater" },
        ],
      },
      {
        title: t('navigation.officeEquipment'),
        items: [
          { title: t('navigation.printingMachines'), href: "/electronics/printing-machines" },
          { title: t('navigation.printersScanners'), href: "/electronics/printers" },
          { title: t('navigation.copiers'), href: "/electronics/copiers" },
        ],
      },
      {
        title: t('navigation.accessories'),
        items: [
          { title: t('navigation.cablesAdapters'), href: "/electronics/cables" },
          { title: t('navigation.mountsStands'), href: "/electronics/mounts" },
        ],
      },
    ],
  },
  {
    label: t('navigation.furniture'),
    href: "/furniture",
    submenu: [
      {
        title: t('navigation.livingRoom'),
        items: [
          { title: t('navigation.sofasCouches'), href: "/furniture/sofas" },
          { title: t('navigation.coffeeTablesTVStands'), href: "/furniture/coffee-tables" },
        ],
      },
      {
        title: t('navigation.bedroom'),
        items: [
          { title: t('navigation.beds'), href: "/furniture/beds" },
          { title: t('navigation.dressersWardrobes'), href: "/furniture/wardrobes" },
        ],
      },
      {
        title: t('navigation.dining'),
        items: [
          { title: t('navigation.diningTables'), href: "/furniture/dining-tables" },
          { title: t('navigation.chairs'), href: "/furniture/chairs" },
        ],
      },
    ],
  },
  {
    label: t('navigation.appliances'),
    href: "/appliances",
    submenu: [
      {
        title: t('navigation.kitchen'),
        items: [
          { title: t('navigation.refrigerators'), href: "/appliances/refrigerators" },
          { title: t('navigation.microwaves'), href: "/appliances/microwaves" },
          { title: t('navigation.ovens'), href: "/appliances/ovens" },
        ],
      },
      {
        title: t('navigation.laundry'),
        items: [
          { title: t('navigation.washingMachines'), href: "/appliances/washing-machines" },
          { title: t('navigation.dryers'), href: "/appliances/dryers" },
        ],
      },
    ],
  },
  {
    label: t('navigation.machinery'),
    href: "/machinery",
    submenu: [
      {
        title: t('navigation.industrial'),
        items: [
          { title: t('navigation.generators'), href: "/machinery/generators" },
          { title: t('navigation.compressors'), href: "/machinery/compressors" },
        ],
      },
      {
        title: t('navigation.construction'),
        items: [
          { title: t('navigation.excavators'), href: "/machinery/excavators" },
          { title: t('navigation.cranes'), href: "/machinery/cranes" },
        ],
      },
    ],
  },
  {
    label: t('navigation.contact'),
    href: "/contact",
  },
];

const NAVIGATION_MENU: MenuItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Vehicles",
    href: "/vehicles",
    submenu: [
      {
        title: "Automobiles",
        items: [
          { title: "Cars", href: "/vehicles/cars" },
          { title: "SUVs & Trucks", href: "/vehicles/suvs-trucks" },
          { title: "Vans & Buses", href: "/vehicles/vans-buses" },
        ],
      },
      {
        title: "Agricultural",
        items: [
          { title: "Tractors", href: "/vehicles/tractors" },
          { title: "Harvesters", href: "/vehicles/harvesters" },
          { title: "Farm Equipment", href: "/vehicles/farm-equipment" },
        ],
      },
      {
        title: "Parts & Accessories",
        items: [
          { title: "Vehicle Parts", href: "/vehicles/parts" },
          { title: "Tractor Parts", href: "/vehicles/tractor-parts" },
        ],
      },
    ],
  },
  {
    label: "Electronics",
    href: "/electronics",
    submenu: [
      {
        title: "Entertainment",
        items: [
          { title: "Televisions", href: "/electronics/tvs" },
          { title: "Smart TVs", href: "/electronics/smart-tvs" },
          { title: "Home Theater", href: "/electronics/home-theater" },
        ],
      },
      {
        title: "Office Equipment",
        items: [
          { title: "Printing Machines", href: "/electronics/printing-machines" },
          { title: "Printers & Scanners", href: "/electronics/printers" },
          { title: "Copiers", href: "/electronics/copiers" },
        ],
      },
      {
        title: "Accessories",
        items: [
          { title: "Cables & Adapters", href: "/electronics/cables" },
          { title: "Mounts & Stands", href: "/electronics/mounts" },
        ],
      },
    ],
  },
  {
    label: "Furniture",
    href: "/furniture",
    submenu: [
      {
        title: "Living Room",
        items: [
          { title: "Sofas & Couches", href: "/furniture/sofas" },
          { title: "Coffee Tables", href: "/furniture/coffee-tables" },
          { title: "TV Stands", href: "/furniture/tv-stands" },
        ],
      },
      {
        title: "Bedroom",
        items: [
          { title: "Beds & Frames", href: "/furniture/beds" },
          { title: "Wardrobes", href: "/furniture/wardrobes" },
          { title: "Dressers", href: "/furniture/dressers" },
        ],
      },
      {
        title: "Office",
        items: [
          { title: "Desks", href: "/furniture/desks" },
          { title: "Office Chairs", href: "/furniture/office-chairs" },
          { title: "Storage", href: "/furniture/storage" },
        ],
      },
    ],
  },
  {
    label: "Appliances",
    href: "/appliances",
    submenu: [
      {
        title: "Refrigeration",
        items: [
          { title: "Refrigerators", href: "/appliances/refrigerators" },
          { title: "Freezers", href: "/appliances/freezers" },
          { 
            title: "Commercial Fridges", 
            href: "/appliances/commercial-fridges",
            badge: { text: "NEW", color: "#28a745" },
          },
        ],
      },
      {
        title: "Kitchen",
        items: [
          { title: "Cooking Ranges", href: "/appliances/ranges" },
          { title: "Microwaves", href: "/appliances/microwaves" },
          { title: "Dishwashers", href: "/appliances/dishwashers" },
        ],
      },
    ],
  },
  {
    label: "Machinery",
    href: "/machinery",
    submenu: [
      {
        title: "Industrial",
        items: [
          { title: "Manufacturing Equipment", href: "/machinery/manufacturing" },
          { title: "Construction Equipment", href: "/machinery/construction" },
          { title: "Power Tools", href: "/machinery/power-tools" },
        ],
      },
      {
        title: "Agricultural",
        items: [
          { title: "Processing Equipment", href: "/machinery/processing" },
          { title: "Irrigation Systems", href: "/machinery/irrigation" },
        ],
      },
    ],
  },

  {
    label: "Contact",
    href: "/contact",
  },
];

const Badge: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <span
    className="absolute top-0 right-0 px-2 py-1 text-xs font-bold text-white rounded"
    style={{ backgroundColor: color }}
  >
    {text}
  </span>
);

const SubMenu: React.FC<{ sections: MenuSection[]; width: string }> = ({
  sections,
  width,
}) => (
  <div
    className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg rounded z-50"
    style={{ width: "min(900px, 95vw)", minWidth: "300px" }}
  >
    <div className="p-4 lg:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase">
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.items.map((item, itemIdx) => (
                <li key={itemIdx} className="relative">
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-gray-900 text-sm"
                  >
                    {item.title}
                  </Link>
                  {item.badge && (
                    <Badge text={item.badge.text} color={item.badge.color} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const NavItem: React.FC<{ item: MenuItem }> = ({ item }) => (
  <li className="group relative">
    <Link
      href={item.href}
      className="nav-link relative px-4 py-2 text-gray-800 font-medium flex items-center gap-1 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-afmondo-orange after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
    >
      {item.label}
      {item.submenu && <ChevronDown className="w-4 h-4 text-gray-400" />}
    </Link>
    {item.submenu && <SubMenu sections={item.submenu} width="min(900px, 95vw)" />}
  </li>
);

const IconButton: React.FC<{
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}> = ({ icon, href, onClick }) => {
  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center justify-center w-8 h-8 hover:opacity-75 transition-opacity"
      >
        {icon}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center w-8 h-8 hover:opacity-75 transition-opacity"
    >
      {icon}
    </button>
  );
};

interface MobileMenuItemProps {
  item: MenuItem;
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between py-3">
        <Link
          href={item.href}
          className="text-gray-800 font-medium hover:text-afmondo-orange"
        >
          {item.label}
        </Link>
        {item.submenu && (
          <button onClick={() => setIsOpen(!isOpen)} className="ml-auto">
            <ChevronDown
              size={18}
              className={`text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {/* Mobile Submenu */}
      {item.submenu && isOpen && (
        <div className="pl-4 pb-3 space-y-2 bg-white">
          {item.submenu.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {section.items.map((subitem, itemIdx) => (
                <Link
                  key={itemIdx}
                  href={subitem.href}
                  className="block text-sm text-gray-600 hover:text-afmondo-orange py-1"
                >
                  {subitem.title}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { getCartCount } = useCart();
  const router = useRouter();
  const NAVIGATION_MENU = getNavigationMenu(t);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartCount = getCartCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          {/* Hamburger Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center justify-center w-10 h-10 -ml-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X size={24} className="text-gray-800" />
            ) : (
              <Menu size={24} className="text-gray-800" />
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="flex-1 text-center">
            <img
              src="/logo.jpeg"
              alt="Store Logo"
              className="h-16 sm:h-16 w-auto inline-block"
            />
          </Link>

          {/* Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:opacity-75 cursor-pointer p-1"
              aria-label="Toggle search"
            >
              <Search size={20} color="#000" />
            </button>
            <Link href="/cart" className="relative p-1">
              <ShoppingCart
                size={20}
                color="#000"
                className="hover:opacity-75 cursor-pointer"
              />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="px-4 sm:px-6 pb-4 pt-3 border-t border-gray-200">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2 text-sm sm:text-base text-gray-900 border border-gray-300 rounded focus:outline-none focus:border-afmondo-orange"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-afmondo-orange text-white font-semibold rounded hover:bg-orange-600 transition"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="border-t border-gray-200 bg-gray-50">
            <div className="px-4 sm:px-6 py-2 max-h-[70vh] overflow-y-auto">
              {NAVIGATION_MENU.map((item, idx) => (
                <MobileMenuItem key={idx} item={item} />
              ))}
              <hr className="my-4" />
              <div className="space-y-3 py-2">
                <Link
                  href="/account/login"
                  className="block text-gray-800 hover:text-afmondo-orange"
                >
                  My Account
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4 gap-4">
            {/* Logo */}
            <div className="shrink-0">
              <Link href="/" className="inline-block">
                <img
                  src="/logo.jpeg"
                  alt="Store Logo"
                  className="h-16 lg:h-20 w-auto"
                />
              </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="grow">
              <ul className="flex justify-center items-center gap-1 lg:gap-2">
                {NAVIGATION_MENU.map((item, idx) => (
                  <NavItem key={idx} item={item} />
                ))}
              </ul>
            </nav>

            {/* Account & Cart */}
            <div className="flex items-center gap-3 lg:gap-4 shrink-0">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hover:opacity-75 cursor-pointer p-1"
                aria-label="Toggle search"
              >
                <Search size={24} color="#000" />
              </button>
              <Link href="/account/login" className="hover:opacity-75 p-1" aria-label="Account">
                <User size={24} color="#000" />
              </Link>
              <Link href="/cart" className="relative p-1" aria-label="Shopping cart">
                <ShoppingCart size={24} color="#000" className="hover:opacity-75" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="pb-4 pt-2">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-4 py-2 text-gray-900 border border-gray-300 rounded focus:outline-none focus:border-afmondo-orange"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-afmondo-orange text-white font-semibold rounded hover:bg-orange-600 transition"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
