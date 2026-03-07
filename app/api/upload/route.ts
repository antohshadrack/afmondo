import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const folder = (formData.get("folder") as string) || "afmondo/products";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Convert file to base64 data URL for Cloudinary upload
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const dataUrl = `data:${file.type};base64,${base64}`;

        const result = await cloudinary.uploader.upload(dataUrl, {
            folder,
            resource_type: "image",
            transformation: [
                { width: 1200, height: 1200, crop: "limit" }, // max 1200x1200
                { quality: "auto:good" },                     // auto compress
                { fetch_format: "auto" },                     // serve webp/avif when supported
            ],
        });

        return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Upload failed";
        console.error("[Cloudinary upload error]", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
