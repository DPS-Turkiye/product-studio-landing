"use client";

import { spaceGrotesk } from "@/app/font";
import { Arrow, Star } from "@/components/icons";
import { useEffect } from "react";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
});

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className={`${spaceGrotesk.className} h-full antialiased`}>
      <body className="min-h-full">
        <section className="section not-found">
          <div className="container">
            <p className="display-xl">
              <Star size={96} color="var(--purple)" />
            </p>
            <h1 className="h2">Something went wrong.</h1>
            <p className="body-lg muted">
              The page could not be loaded. Try again.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => retry()}
            >
              <span>Try again</span>
              <Arrow size={16} />
            </button>
          </div>
        </section>
      </body>
    </html>
  );
}
