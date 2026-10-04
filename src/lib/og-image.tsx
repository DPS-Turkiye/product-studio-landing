import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fonts = [
  {
    name: "Space Grotesk",
    data: readFileSync(
      join(process.cwd(), "src/fonts/SpaceGrotesk-500-latin.ttf"),
    ),
    weight: 500 as const,
    style: "normal" as const,
  },
  {
    name: "Space Grotesk",
    data: readFileSync(
      join(process.cwd(), "src/fonts/SpaceGrotesk-500-latin-ext.ttf"),
    ),
    weight: 500 as const,
    style: "normal" as const,
  },
];

const copy = {
  en: {
    lines: ["Real challenges.", "Real teams.", "Real products."],
    place: "Ankara · 12 weeks",
  },
  tr: {
    lines: ["Gerçek problemler.", "Gerçek ekipler.", "Gerçek ürünler."],
    place: "Ankara · 12 hafta",
  },
} as const;

export function renderOgImage(locale: string) {
  const card = locale === "tr" ? copy.tr : copy.en;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0B0D14",
        color: "#FFFFFF",
        padding: "72px 80px",
        fontFamily: "Space Grotesk",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: 22,
            height: 22,
            background: "#A6FF00",
            marginRight: 18,
          }}
        />
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 4 }}>
          PRODUCT STUDIO
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 76,
          lineHeight: 1.05,
        }}
      >
        <div style={{ display: "flex" }}>{card.lines[0]}</div>
        <div style={{ display: "flex" }}>{card.lines[1]}</div>
        <div style={{ display: "flex", color: "#A6FF00" }}>{card.lines[2]}</div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#B8B8C2" }}>
          {card.place}
        </div>
        <div
          style={{
            display: "flex",
            width: 96,
            height: 8,
            background: "#5832FF",
          }}
        />
      </div>
    </div>,
    {
      ...ogSize,
      fonts,
    },
  );
}
