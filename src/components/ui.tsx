import { Link } from "@/i18n/navigation";
import { img, initials } from "@/lib/content";
import Image from "next/image";
import { Breadcrumbs } from "./breadcrumbs";
import { Arrow, Star } from "./icons";
import type { TeamPartner } from "@/lib/content";
import type { Crumb } from "@/lib/structured-data";
import type { ComponentProps, ReactNode } from "react";

type LinkHref = ComponentProps<typeof Link>["href"];

export function Button({
  to,
  variant = "primary",
  children,
  arrow = true,
  className = "",
}: {
  to?: LinkHref;
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
  crumbs,
  breadcrumbLabel,
}: {
  label: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  crumbs?: Crumb[];
  breadcrumbLabel?: string;
}) {
  return (
    <section className="page-hero">
      <div className="container page-hero__inner">
        {crumbs && breadcrumbLabel ? (
          <Breadcrumbs items={crumbs} label={breadcrumbLabel} />
        ) : null}
        <SectionLabel>{label}</SectionLabel>
        <h1 className="display-lg page-hero__title">
          {title}
          <Star className="page-hero__star" size={64} color="var(--purple)" />
        </h1>
        {intro && <p className="body-lg page-hero__intro">{intro}</p>}
        {children}
      </div>
      <Image
        className="page-hero__brush"
        src="/images/brush-purple.png"
        alt=""
        width={592}
        height={400}
        loading="eager"
        aria-hidden
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
  const sizes = size === "sm" ? "40px" : size === "xl" ? "320px" : "56px";
  return (
    <div className={`avatar avatar-${size}`}>
      {src?.endsWith(".svg") ? (
        <img src={src} alt="" />
      ) : src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
    </div>
  );
}

export function PartnerStrip({ partners }: { partners: TeamPartner[] }) {
  if (partners.length === 0) return null;
  return (
    <div className="partner-strip">
      {partners.map((partner) => {
        const content = partner.logo ? (
          <img
            src={img(partner.logo) ?? ""}
            alt={partner.name}
            className={partner.logoInvert ? "logo-invert" : undefined}
          />
        ) : (
          <span>{partner.name}</span>
        );
        return partner.website ? (
          <a
            className="partner-strip__item"
            key={partner.name}
            href={partner.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content}
          </a>
        ) : (
          <div className="partner-strip__item" key={partner.name}>
            {content}
          </div>
        );
      })}
    </div>
  );
}
