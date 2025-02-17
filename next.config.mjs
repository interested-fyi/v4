/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => {
    const ContentSecurityPolicy = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://telegram.org https://auth.privy.io https://cloudflare-eth.com/ https://us-assets.i.posthog.com https://vercel.live/_next-live/feedback/feedback.js",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https: https://i.imgur.com",
      "media-src 'self'",
      "connect-src 'self' https://auth.privy.io wss://relay.walletconnect.com wss://relay.walletconnect.org wss://www.walletlink.org https://*.rpc.privy.systems https://api.mainnet-beta.solana.com https://api.devnet.solana.com https://api.testnet.solana.com https://api.relay.link https://api.testnets.relay.link https://sepolia.optimism.io https://explorer-api.walletconnect.com https://pulse.walletconnect.org https://us.i.posthog.com https://mainnet.optimism.io/",
      "frame-src 'self' https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org https://challenges.cloudflare.com https://oauth.telegram.org https://vercel.live/",
      "child-src 'self' https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "font-src 'self' data:",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy-Report-Only", // Still in report-only mode for testing
            value: ContentSecurityPolicy,
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { hostname: "*" },
      {
        protocol: "https",
        hostname: "i.imgur.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.py$/,
      loader: "ignore-loader",
    });

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
  },
};

export default nextConfig;
