import batchesFile from "../../content/batches.json";
import mentorsFile from "../../content/mentors.json";
import siteFile from "../../content/site.json";

export type LocaleText = string | { en: string; tr: string };

export type Site = {
  contactEmail: string;
  partnerEmail: string;
  senderEmail: string;
  location: LocaleText;
  social: { linkedin: string; instagram: string; youtube: string };
  applications: {
    open: boolean;
    batch: string;
    season?: LocaleText;
    programStart?: string;
    programEnd?: string;
    deadline?: string;
    format: LocaleText;
    durationWeeks: number;
  };
  stats: { value: string; label: LocaleText }[];
  showParticipantLinkedin?: boolean;
};

export type Member = {
  name: string;
  role: string;
  photo?: string;
  linkedin?: string;
};

export type TeamPartner = {
  name: string;
  logo?: string;
  logoInvert?: boolean;
  website?: string;
};

export type Team = {
  id: string;
  name: string;
  partner: TeamPartner;
  challenge?: LocaleText;
  tags?: string[];
  members: Member[];
};

export type Batch = {
  id: string;
  name: string;
  season: LocaleText;
  start?: string;
  end?: string;
  status: string;
  summary?: LocaleText;
  photo?: string;
  teams: Team[];
};

export type Mentor = {
  name: string;
  title: LocaleText;
  company?: string;
  photo?: string;
  linkedin?: string;
};

export const site = siteFile as Site;
export const batches = batchesFile.batches as Batch[];
export const mentors = mentorsFile.mentors as Mentor[];

export const partners: TeamPartner[] = [];
for (const batch of batches) {
  for (const team of batch.teams) {
    if (!partners.some((partner) => partner.name === team.partner.name)) {
      partners.push(team.partner);
    }
  }
}

export function loc(value: LocaleText | undefined, locale: string) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return locale === "tr" ? value.tr : value.en;
}

export function img(src?: string) {
  if (!src) return null;
  if (/^(https?:)?\/\//.test(src) || src.startsWith("/")) return src;
  return `/content/images/${src}`;
}

export function initials(name = "") {
  return name
    .split(/\s+/)
    .filter((word) => /^\p{L}/u.test(word))
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

const MONTHS = {
  en: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  tr: [
    "Oca",
    "Şub",
    "Mar",
    "Nis",
    "May",
    "Haz",
    "Tem",
    "Ağu",
    "Eyl",
    "Eki",
    "Kas",
    "Ara",
  ],
};

export function formatDate(iso: string | undefined, locale: string) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-").map(Number);
  const names = locale === "tr" ? MONTHS.tr : MONTHS.en;
  return `${day} ${names[month - 1]} ${year}`;
}

export function formatRange(start: string, end: string, locale: string) {
  return `${formatDate(start, locale)} — ${formatDate(end, locale)}`;
}
