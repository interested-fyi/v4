import { UserCombinedProfile } from "@/types/return_types";
import fs from "fs";
import path from "path";
import React from "react";
import satori from "satori";

async function generateProfileImage({ user }: { user: UserCombinedProfile }) {
  const { name, bio, position, photo_source } = user;
  const ImageContent = (
    <div
      style={{
        width: "300px",
        height: "120px",
        backgroundColor: "#f0f4f8",
        borderRadius: "12px",
        padding: "16px",
        boxSizing: "border-box",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          overflow: "hidden",
          marginRight: "16px",
          flexShrink: 0,
        }}
      >
        <img
          src={photo_source ?? ""}
          alt={name ?? "Profile picture"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
      <div
        style={{
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <h2
          style={{
            margin: "0 0 4px 0",
            fontSize: "18px",
            fontWeight: 600,
            color: "#1a202c",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </h2>
        <p
          style={{
            margin: "0 0 4px 0",
            fontSize: "14px",
            color: "#4a5568",
            fontWeight: 500,
          }}
        >
          {position?.[0]}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: "#718096",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {bio}
        </p>
      </div>
    </div>
  );
  // Satori configuration
  const fontPath = path.join(
    process.cwd(),
    "public/fonts/Inter/static/Inter_18pt-Black.ttf"
  );
  const fontData = fs.readFileSync(fontPath);

  const svg = await satori(ImageContent, {
    width: 800,
    height: 400,
    fonts: [
      {
        name: "Roboto",
        // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
        data: fontData,
        weight: 400,
        style: "normal",
      },
    ],
  });

  return svg; // Returns the SVG image
}
