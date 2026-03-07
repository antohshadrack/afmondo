import { createClient } from "./client";
import type { Product } from "@/app/components/shared/ProductCard";

// ── Types ──────────────────────────────────────────────────────────

export interface DbProduct {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    original_price: number | null;
    discount: number | null;
    brand: string | null;
    category_id: string | null; // kept for backward compat; use product_categories for multi-category
    images: string[];
    is_active: boolean;
    is_featured: boolean;
    is_flash_sale: boolean;
    flash_sale_ends: string | null;
    created_at: string;
    // populated when fetched via product_categories join
    category_ids?: string[];
}

export interface DbProductCategory {
    product_id: string;
    category_id: string;
}

export interface DbCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    parent_id: string | null;
    sort_order: number;
}

export interface DbInventory {
    id: string;
    product_id: string;
    quantity: number;
    low_stock_threshold: number;
    updated_at: string;
    products?: DbProduct;
}

export interface DbOrder {
    id: string;
    user_id: string | null;
    status: string;
    total: number;
    delivery_fee: number;
    delivery_name: string | null;
    delivery_phone: string | null;
    delivery_city: string | null;
    delivery_address: string | null;
    notes: string | null;
    created_at: string;
    order_items?: DbOrderItem[];
}

export interface DbOrderItem {
    id: string;
    order_id: string;
    product_id: string;
    name: string;
    image: string | null;
    price: number;
    quantity: number;
}

// ── Mapper: DB → ProductCard.Product ─────────────────────────────

export function mapDbProduct(p: DbProduct): Product {
    return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description ?? undefined,
        price: p.price,
        originalPrice: p.original_price ?? undefined,
        discount: p.discount ?? undefined,
        brand: p.brand ?? undefined,
        image: p.images?.[0] ?? "/products/placeholder.jpg",
        images: p.images,
        flash_sale_ends: p.flash_sale_ends ?? undefined,
    };
}

// ── Product queries ───────────────────────────────────────────────

export async function getProducts(opts: {
    categorySlug?: string;
    search?: string;
    featured?: boolean;
    flashSale?: boolean;
    limit?: number;
    orderBy?: "price_asc" | "price_desc" | "newest";
} = {}): Promise<Product[]> {
    const supabase = createClient();
    let query = supabase.from("products").select("*").eq("is_active", true);

    if (opts.featured) query = query.eq("is_featured", true);
    if (opts.flashSale) {
        query = query.eq("is_flash_sale", true).gt("flash_sale_ends", new Date().toISOString());
    }
    if (opts.search) query = query.ilike("name", `%${opts.search}%`);
    if (opts.categorySlug) {
        // Look up the matching category by slug
        const { data: cat } = await supabase
            .from("categories")
            .select("id")
            .eq("slug", opts.categorySlug)
            .maybeSingle();
        if (!cat) return []; // no matching category → return nothing

        // Get all product IDs that belong to this category (via junction table)
        const { data: links } = await supabase
            .from("product_categories")
            .select("product_id")
            .eq("category_id", cat.id);
        const productIds = (links ?? []).map((l) => l.product_id);
        if (productIds.length === 0) return [];
        query = query.in("id", productIds);
    }
    if (opts.orderBy === "price_asc") query = query.order("price", { ascending: true });
    else if (opts.orderBy === "price_desc") query = query.order("price", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    if (opts.limit) query = query.limit(opts.limit);

    const { data, error } = await query;
    if (error || !data) return [];
    return data.map(mapDbProduct);
}

export async function getProduct(idOrSlug: string): Promise<DbProduct | null> {
    const supabase = createClient();

    // 1. Try slug first (most links use slug)
    const { data: bySlug } = await supabase
        .from("products")
        .select("*")
        .eq("slug", idOrSlug)
        .maybeSingle();

    if (bySlug) return bySlug;

    // 2. Fall back to id (UUID) lookup
    const { data: byId } = await supabase
        .from("products")
        .select("*")
        .eq("id", idOrSlug)
        .maybeSingle();

    return byId ?? null;
}

export async function getFeaturedProducts(limit = 10): Promise<Product[]> {
    return getProducts({ featured: true, limit });
}

export async function getFlashSaleProducts(limit = 8): Promise<Product[]> {
    return getProducts({ flashSale: true, limit });
}

// ── Category queries ──────────────────────────────────────────────

export async function getCategories(): Promise<DbCategory[]> {
    const supabase = createClient();
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    return data ?? [];
}

// ── Inventory queries (admin) ─────────────────────────────────────

export async function getInventory(): Promise<DbInventory[]> {
    const supabase = createClient();
    const { data } = await supabase
        .from("inventory")
        .select("*, products(id, name, slug, images, price)")
        .order("updated_at", { ascending: false });
    return (data as DbInventory[]) ?? [];
}

export async function upsertInventory(productId: string, quantity: number, threshold = 5) {
    const supabase = createClient();
    return supabase.from("inventory").upsert({
        product_id: productId,
        quantity,
        low_stock_threshold: threshold,
        updated_at: new Date().toISOString(),
    }, { onConflict: "product_id" });
}

// ── Order queries (admin) ─────────────────────────────────────────

export async function getOrders(limit = 50): Promise<DbOrder[]> {
    const supabase = createClient();
    const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false })
        .limit(limit);
    return (data as DbOrder[]) ?? [];
}

export async function updateOrderStatus(orderId: string, status: string) {
    const supabase = createClient();
    return supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", orderId);
}

// ── Stats (admin dashboard) ───────────────────────────────────────

export async function getDashboardStats() {
    const supabase = createClient();
    const [
        { count: totalProducts },
        { count: totalOrders },
        { data: revenue },
        { count: lowStock },
    ] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total").in("status", ["confirmed", "processing", "dispatched", "delivered"]),
        supabase.from("inventory").select("*", { count: "exact", head: true }).filter("quantity", "lte", "low_stock_threshold"),
    ]);

    const totalRevenue = revenue?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0;

    return { totalProducts: totalProducts ?? 0, totalOrders: totalOrders ?? 0, totalRevenue, lowStock: lowStock ?? 0 };
}

// ── Recent data (admin dashboard) ─────────────────────────────────

export async function getRecentOrders(limit = 5): Promise<DbOrder[]> {
    const supabase = createClient();
    const { data } = await supabase
        .from("orders")
        .select("id, status, total, delivery_name, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);
    return (data as DbOrder[]) ?? [];
}

export async function getRecentProducts(limit = 5): Promise<DbProduct[]> {
    const supabase = createClient();
    const { data } = await supabase
        .from("products")
        .select("id, name, slug, images, price, is_active, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);
    return (data as DbProduct[]) ?? [];
}

// ── product_categories junction helpers ───────────────────────────

/** Returns all category IDs a product belongs to */
export async function getProductCategoryIds(productId: string): Promise<string[]> {
    const supabase = createClient();
    const { data } = await supabase
        .from("product_categories")
        .select("category_id")
        .eq("product_id", productId);
    return (data ?? []).map((r) => r.category_id);
}

/**
 * Replaces all category links for a product.
 * Deletes existing rows then inserts the new set.
 */
export async function setProductCategories(productId: string, categoryIds: string[]): Promise<void> {
    const supabase = createClient();
    await supabase.from("product_categories").delete().eq("product_id", productId);
    if (categoryIds.length === 0) return;
    await supabase.from("product_categories").insert(
        categoryIds.map((cid) => ({ product_id: productId, category_id: cid }))
    );
}

// ── Analytics ─────────────────────────────────────────────────────

export interface MonthlyRevenue {
    month: string;
    fullKey: string;
    revenue: number;
    orders: number;
}

export async function getMonthlyRevenue(months = 12): Promise<MonthlyRevenue[]> {
    const supabase = createClient();
    const since = new Date();
    since.setMonth(since.getMonth() - months);
    const { data } = await supabase
        .from("orders").select("created_at, total, status")
        .gte("created_at", since.toISOString())
        .neq("status", "cancelled").neq("status", "refunded");
    if (!data) return [];
    const byMonth: Record<string, { revenue: number; orders: number }> = {};
    data.forEach((o) => {
        const d = new Date(o.created_at);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (!byMonth[key]) byMonth[key] = { revenue: 0, orders: 0 };
        byMonth[key].revenue += Number(o.total);
        byMonth[key].orders += 1;
    });
    const NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return Object.entries(byMonth).sort(([a],[b]) => a.localeCompare(b))
        .map(([key, val]) => ({ month: NAMES[parseInt(key.split("-")[1])-1], fullKey: key, ...val }));
}

export interface CityOrders { city: string; count: number; revenue: number }

export async function getOrdersByCity(limit = 8): Promise<CityOrders[]> {
    const supabase = createClient();
    const { data } = await supabase.from("orders").select("delivery_city, total").neq("status", "cancelled");
    if (!data) return [];
    const map: Record<string, CityOrders> = {};
    data.forEach((o) => {
        const city = o.delivery_city?.trim() || "Unknown";
        if (!map[city]) map[city] = { city, count: 0, revenue: 0 };
        map[city].count += 1;
        map[city].revenue += Number(o.total);
    });
    return Object.values(map).sort((a,b) => b.count - a.count).slice(0, limit);
}

export interface TopProduct { name: string; orders: number; revenue: number }

export async function getTopProducts(limit = 6): Promise<TopProduct[]> {
    const supabase = createClient();
    const { data } = await supabase.from("order_items").select("name, quantity, price");
    if (!data) return [];
    const map: Record<string, TopProduct> = {};
    data.forEach((item) => {
        if (!map[item.name]) map[item.name] = { name: item.name, orders: 0, revenue: 0 };
        map[item.name].orders += item.quantity;
        map[item.name].revenue += Number(item.price) * item.quantity;
    });
    return Object.values(map).sort((a,b) => b.orders - a.orders).slice(0, limit);
}

export interface PageViewStat { path: string; views: number }

export async function trackPageView(path: string) {
    try {
        const supabase = createClient();
        await supabase.from("page_views").insert({ path, viewed_at: new Date().toISOString() });
    } catch { /* ignore if table missing */ }
}

export async function getTopPages(limit = 8): Promise<PageViewStat[]> {
    try {
        const supabase = createClient();
        const { data } = await supabase.from("page_views").select("path");
        if (!data) return [];
        const map: Record<string, number> = {};
        data.forEach((r) => { map[r.path] = (map[r.path] ?? 0) + 1; });
        return Object.entries(map).sort(([,a],[,b]) => b-a).slice(0,limit).map(([path,views]) => ({ path, views }));
    } catch { return []; }
}
