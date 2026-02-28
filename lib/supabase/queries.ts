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
    category_id: string | null;
    images: string[];
    is_active: boolean;
    is_featured: boolean;
    is_flash_sale: boolean;
    flash_sale_ends: string | null;
    created_at: string;
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
        const { data: cat } = await supabase.from("categories").select("id").eq("slug", opts.categorySlug).single();
        if (cat) query = query.eq("category_id", cat.id);
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
    const { data } = await supabase
        .from("products")
        .select("*")
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .single();
    return data ?? null;
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
