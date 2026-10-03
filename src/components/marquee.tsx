"use client";

import { Arrow, Star } from "@/components/icons";
import { useEffect, useRef, useState } from "react";

const SPEED = 48;

function Sequence({ items }: { items: string[] }) {
  return (
    <div className="marquee__sequence">
      {items.flatMap((word, index) => [
        <span key={`w-${index}`}>{word}</span>,
        index % 2 === 0 ? (
          <Star key={`s-${index}`} size={18} color="var(--lime)" />
        ) : (
          <Arrow key={`a-${index}`} size={18} className="lime" />
        ),
      ])}
    </div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(4);
  const [duration, setDuration] = useState(40);

  useEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const fit = () => {
      const sequenceWidth = measure.scrollWidth;
      const containerWidth = container.clientWidth;
      if (sequenceWidth === 0 || containerWidth === 0) return;

      const nextCopies = Math.max(1, Math.ceil(containerWidth / sequenceWidth));
      const nextDuration =
        Math.round(((nextCopies * sequenceWidth) / SPEED) * 100) / 100;

      setCopies((current) => (current === nextCopies ? current : nextCopies));
      setDuration((current) =>
        current === nextDuration ? current : nextDuration,
      );
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(container);
    observer.observe(measure);
    return () => observer.disconnect();
  }, [items]);

  return (
    <div
      className="marquee"
      ref={containerRef}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      <p className="sr-only">{items.join(", ")}</p>
      <div className="marquee__measure" ref={measureRef} aria-hidden="true">
        <Sequence items={items} />
      </div>
      <div className="marquee__track" aria-hidden="true">
        {[0, 1].map((half) => (
          <div className="marquee__group" key={half}>
            {Array.from({ length: copies }, (_, loop) => (
              <Sequence items={items} key={loop} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
