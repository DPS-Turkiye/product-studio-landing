"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { formatRange, img, loc, site } from "@/lib/content";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { Arrow, Star } from "./icons";
import { Avatar, Tag } from "./ui";
import type { Batch } from "@/lib/content";

const ROLE_ORDER = [
  "product-manager",
  "interaction-designer",
  "software-engineer",
];

function LinkedInLink({ href, name }: { href?: string; name: string }) {
  const t = useTranslations("common");
  if (!href) return null;
  return (
    <a
      className="icon-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("linkedin", { name })}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
      </svg>
    </a>
  );
}

function PartnerMark({
  partner,
}: {
  partner: Batch["teams"][number]["partner"];
}) {
  const logo = img(partner.logo);
  const content = logo ? (
    <img
      src={logo}
      alt={partner.name}
      className={`partner-mark__logo ${partner.logoInvert ? "logo-invert" : ""}`}
    />
  ) : (
    <span className="partner-mark__name">{partner.name}</span>
  );
  return partner.website ? (
    <a
      href={partner.website}
      target="_blank"
      rel="noopener noreferrer"
      className="partner-mark"
    >
      {content}
    </a>
  ) : (
    <div className="partner-mark">{content}</div>
  );
}

export function CasesBrowser({
  batches,
  activeId,
}: {
  batches: Batch[];
  activeId: string;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const active = batches.find((batch) => batch.id === activeId) ?? batches[0];
  const photo = img(active?.photo);

  useEffect(() => {
    if (!active || !window.location.hash) return;
    const el = document.getElementById(window.location.hash.slice(1));
    if (el) {
      const timer = window.setTimeout(
        () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
        50,
      );
      return () => window.clearTimeout(timer);
    }
  }, [active]);

  const counts = useMemo(() => {
    if (!active) return null;
    return {
      teams: active.teams.length,
      participants: active.teams.reduce(
        (total, team) => total + team.members.length,
        0,
      ),
      partners: new Set(active.teams.map((team) => team.partner.name)).size,
    };
  }, [active]);

  if (!active || !counts) return null;

  const teams = active.teams;

  return (
    <>
      <div
        className="batch-tabs"
        role="tablist"
        aria-label={t("cases.selectBatch")}
      >
        {batches.map((batch) => (
          <Link
            key={batch.id}
            role="tab"
            aria-selected={batch.id === active.id}
            className={`batch-tab ${batch.id === active.id ? "is-active" : ""}`}
            href={{ pathname: "/cases/[batch]", params: { batch: batch.id } }}
            scroll={false}
          >
            <span className="batch-tab__name">{batch.name}</span>
            <span className="batch-tab__season">
              {loc(batch.season, locale)}
            </span>
          </Link>
        ))}
      </div>

      <div className="batch-overview">
        <div className="batch-overview__main">
          <div className="batch-overview__title">
            <h2 className="h2">{active.name}</h2>
            <Tag
              variant={
                active.status === "ongoing"
                  ? "lime"
                  : active.status === "upcoming"
                    ? "purple"
                    : ""
              }
            >
              {t(`cases.status.${active.status}`)}
            </Tag>
          </div>
          <p className="label muted">
            {active.start && active.end
              ? formatRange(active.start, active.end, locale)
              : loc(active.season, locale)}
          </p>
          {active.summary && (
            <p className="body-lg">{loc(active.summary, locale)}</p>
          )}
        </div>
        <dl className="batch-overview__stats">
          <div>
            <dt className="label">{t("cases.teams")}</dt>
            <dd>{counts.teams}</dd>
          </div>
          <div>
            <dt className="label">{t("cases.participants")}</dt>
            <dd>{counts.participants}</dd>
          </div>
          <div>
            <dt className="label">{t("cases.partners")}</dt>
            <dd>{counts.partners}</dd>
          </div>
        </dl>
        {photo &&
          (photo.endsWith(".svg") ? (
            <img
              className="batch-overview__photo project-image"
              src={photo}
              alt={active.name}
            />
          ) : (
            <div className="batch-overview__photo">
              <Image
                className="project-image"
                src={photo}
                alt={active.name}
                fill
                sizes="(max-width: 800px) 100vw, 1120px"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
      </div>

      {teams.length === 0 ? (
        <p className="state-msg">{t("cases.empty")}</p>
      ) : (
        <div className="team-grid">
          {teams.map((team) => {
            const members = [...team.members].sort(
              (a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role),
            );
            return (
              <article className="team-card" id={team.id} key={team.id}>
                <header className="team-card__head">
                  <div>
                    <p className="label muted">{t("cases.partner")}</p>
                    <PartnerMark partner={team.partner} />
                  </div>
                  <Star size={26} color="var(--purple)" />
                </header>
                <div className="team-card__body">
                  <h3 className="team-card__name">{team.name}</h3>
                  {team.challenge && (
                    <>
                      <p className="label muted">{t("cases.challenge")}</p>
                      <p className="team-card__challenge">
                        {loc(team.challenge, locale)}
                      </p>
                    </>
                  )}
                  {team.tags && team.tags.length > 0 && (
                    <div className="tag-row">
                      {team.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  )}
                </div>
                <div className="team-card__members">
                  <p className="label muted">{t("cases.members")}</p>
                  <ul>
                    {members.map((member, index) => {
                      return (
                        <li key={index} className="member">
                          <Avatar
                            name={member.name}
                            photo={member.photo}
                            size="sm"
                          />
                          <div className="member__text">
                            <span className="member__name">{member.name}</span>
                            <span
                              className={`member__role role-${member.role}`}
                            >
                              {t(`roles.${member.role}`)}
                            </span>
                          </div>
                          {site.showParticipantLinkedin && (
                            <LinkedInLink
                              href={member.linkedin}
                              name={member.name}
                            />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {batches.length > 1 && (
        <div className="batch-pager">
          {batches
            .filter((batch) => batch.id !== active.id)
            .map((batch) => (
              <button
                key={batch.id}
                type="button"
                className="batch-pager__link"
                onClick={() =>
                  router.push({
                    pathname: "/cases/[batch]",
                    params: { batch: batch.id },
                  })
                }
              >
                <span className="label muted">{loc(batch.season, locale)}</span>
                <span className="batch-pager__name">
                  {batch.name} <Arrow size={20} />
                </span>
              </button>
            ))}
        </div>
      )}
    </>
  );
}
