import { Metadata } from "next";

export const metadata: Metadata = {
  title: "basic frame",
  description: "basic frame",
  openGraph: {
    title: "basic frame",
    description: "basic frame",
    images: ["https://df54-185-214-97-9.ngrok-free.app/images/binoculars.png"],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image":
      "https://df54-185-214-97-9.ngrok-free.app/images/binoculars.png",
    "fc:frame:post_url":
      "https://df54-185-214-97-9.ngrok-free.app//api/farcaster/frames/basic?id=1",
    "fc:frame:button:1": "start",
  },
};

export default function Page() {
  return <></>;
}
