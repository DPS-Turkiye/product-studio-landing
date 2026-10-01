import { Link } from "@/i18n/navigation";
import { img, initials } from "@/lib/content";
import { Arrow, Star } from "./icons";
import type { ReactNode } from "react";

export function Button({
  to,
  variant = "primary",
  children,
  arrow = true,
  className = "",
}: {
  to?: string;
  variant?: string;
  children: ReactNode;
  arrow?: boolean;
  className?: string;
}) {
  const cls = `btn btn-${variant} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <Arrow size={16} />}
    </>
  );
  if (to) {
    return (
      <Link href={to} className={cls}>
        {inner}
      </Link>
    );
  }
  return <button className={cls}>{inner}</button>;
}

export function SectionLabel({
  index,
  children,
  light = false,
}: {
  index?: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <p className={`section-label ${light ? "is-light" : ""}`}>
      {index && <span className="section-label__index">{index} —</span>}{" "}
      {children}
    </p>
  );
}

export function Tag({
  children,
  variant = "",
}: {
  children: ReactNode;
  variant?: string;
}) {
  return (
    <span className={`tag ${variant ? `tag-${variant}` : ""}`}>{children}</span>
  );
}

export function PageHero({
  label,
  title,
  intro,
  children,
}: {
  label: string;
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-hero">
      <div className="container page-hero__inner">
        <SectionLabel>{label}</SectionLabel>
        <h1 className="display-lg page-hero__title">
          {title}
          <Star className="page-hero__star" size={64} color="var(--purple)" />
        </h1>
        {intro && <p className="body-lg page-hero__intro">{intro}</p>}
        {children}
      </div>
      <img
        className="page-hero__brush"
        src="/images/brush-purple.png"
        alt=""
        aria-hidden="true"
      />
    </section>
  );
}

export function Avatar({
  name,
  photo,
  size = "md",
}: {
  name: string;
  photo?: string;
  size?: string;
}) {
  const src = img(photo);
  return (
    <div className={`avatar avatar-${size}`}>
      {src ? (
        <img src={src} alt="" loading="lazy" />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
    </div>
  );
}
