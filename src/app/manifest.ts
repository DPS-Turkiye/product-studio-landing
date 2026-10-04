import en from "../../messages/en.json";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Product Studio",
    short_name: "Product Studio",
    description: en.Metadata.description,
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: "#0B0D14",
    theme_color: "#0B0D14",
    lang: "en",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
