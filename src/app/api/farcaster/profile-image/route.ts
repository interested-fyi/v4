import { generateProfileImage } from "@/lib/satori";
import supabase from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

// Check if a user follows a profile
export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    //{ name, bio, position, photo_source }
    const privy_did = searchParams.get("privy_did");
    const { data: userData, error: userError } = await supabase.from("user_profile_combined").select("*").eq("privy_did", `did:privy:${privy_did}`).single();

    const image = await generateProfileImage({ user: { name: userData?.name, bio: userData?.bio, position: userData?.position, photo_source: userData?.photo_source } });
    const svgBuffer = Buffer.from(image, 'utf-8');
    const imageBuffer = await sharp(svgBuffer).png().toBuffer();

    return new NextResponse(imageBuffer, {
        headers: {
            'Content-Type': 'image/png'
        }
    });
}