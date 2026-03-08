/**
 * Formats a number to CFA currency format uniformly across all environments
 * (Server/Node and Client/macOS/iOS/Windows).
 * 
 * Bypasses Date/Intl toLocaleString() which often uses different space characters 
 * (e.g. regular space vs non-breaking space \u00A0) depending on the OS,
 * which causes Next.js React hydration mismatch errors.
 */
export function formatPrice(price: number | string | undefined | null): string {
    if (price === undefined || price === null) return "0";

    const num = typeof price === "string" ? parseFloat(price) : price;
    if (isNaN(num)) return "0";

    // Formats 1234567 as "1 234 567" explicitly using a regular space
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
