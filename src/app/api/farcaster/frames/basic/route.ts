import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>basic frame</title>
      <meta property="og:title" content="basic frame" />
      <meta property="fc:frame" content="vNext" />
      <meta property="og:description" content="basic frame" /> <meta
        property="og:image"
        content="https://df54-185-214-97-9.ngrok-free.app/images/Interested-logo.png"
      />
      <meta
        property="fc:frame:image"
        content="https://df54-185-214-97-9.ngrok-free.app/images/Interested-logo.png"
      />
      <meta property="fc:frame:button:1" content="stop" />
    </head>
    <body></body>
  </html>`;

  return new NextResponse(htmlContent, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
