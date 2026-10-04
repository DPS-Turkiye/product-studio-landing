export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configured) {
    return configured.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export function absoluteUrl(pathname: string) {
  const url = new URL(pathname, getSiteUrl()).href;
  if (pathname === "/") return url.replace(/\/$/, "");
  return url;
}
