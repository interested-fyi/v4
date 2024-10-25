import { generateProfileImage } from "@/lib/satori";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

// Check if a user follows a profile
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    //{ name, bio, position, photo_source }
    const name = searchParams.get("name");
    const bio = searchParams.get('bio');
    const position = searchParams.get('position')?.split(',').map((pos) => pos.trim()).filter((pos) => pos) ?? null;
    const photo_source = searchParams.get('photo_source');

    const image = await generateProfileImage({ user: { name, bio, position, photo_source } });
    const svgBuffer = Buffer.from(image, 'utf-8');
    const imageBuffer = await sharp(svgBuffer).png().toBuffer();

    return new NextResponse(imageBuffer, {
        headers: {
            'Content-Type': 'image/png'
        }
    });
}