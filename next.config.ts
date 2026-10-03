import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

function productionSecurityHeaders() {
  const onVercel = Boolean(process.env.VERCEL);

  return [
    ...(onVercel
      ? [
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ]
      : []),
    {
      key: "X-XSS-Protection",
      value: "1; mode=block",
    },
    {
      key: "X-Frame-Options",
      value: "SAMEORIGIN",
    },
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    {
      key: "Referrer-Policy",
      value: "no-referrer-when-downgrade",
    },
    {
      key: "Permissions-Policy",
      value:
        "geolocation=(),midi=(),sync-xhr=(),microphone=(),camera=(),magnetometer=(),gyroscope=(),fullscreen=(self),payment=()",
    },
    {
      key: "Content-Security-Policy",
      value: [
        "base-uri 'self'",
        "object-src 'none'",
        "frame-ancestors 'self'",
        ...(onVercel ? ["upgrade-insecure-requests"] : []),
      ].join("; "),
    },
    {
      key: "Cross-Origin-Opener-Policy",
      value: "same-origin-allow-popups",
    },
  ];
}

const nextConfig: NextConfig = {
  async headers() {
    if (process.env.NODE_ENV !== "production") {
      return [];
    }

    return [
      {
        source: "/(.*)",
        headers: productionSecurityHeaders(),
      },
    ];
  },
};

export default withNextIntl(nextConfig);
