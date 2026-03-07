/**
 * Uploads a single image file to Cloudinary via the secure server-side API route.
 * Returns the public CDN URL, or throws on failure.
 */
export async function uploadToCloudinary(
    file: File,
    folder = "afmondo/products"
): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const json = await res.json();

    if (!res.ok || json.error) {
        throw new Error(json.error ?? "Image upload failed");
    }

    return json.url as string;
}

/**
 * Uploads multiple files in sequence and returns an array of CDN URLs.
 * Skips a file silently if it fails (instead of aborting the whole batch).
 */
export async function uploadMultipleToCloudinary(
    files: File[],
    folder = "afmondo/products"
): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
        try {
            const url = await uploadToCloudinary(file, folder);
            urls.push(url);
        } catch (err) {
            console.error(`Failed to upload ${file.name}:`, err);
        }
    }
    return urls;
}
