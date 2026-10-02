<p align="center">
  <img src="public/images/logo-email.png" alt="Product Studio" width="480">
</p>

<p align="center">
  <strong>Real challenges. Real teams. Real products.</strong><br>
  Gerçek problemler. Gerçek ekipler. Gerçek ürünler.
</p>

<p align="center">
  <a href="https://productstudio.com.tr">productstudio.com.tr</a>
</p>

Product Studio is a hands-on program where interdisciplinary teams of product managers, designers, software engineers, and AI engineers turn company challenges into tested digital products. This repository is the public website: program pages, case studies, and the application and partner forms.

The site is in English and Turkish. English is the default. Turkish lives under `/tr`.

## Stack

| Package                                                          | Role                                             |
| ---------------------------------------------------------------- | ------------------------------------------------ |
| [Next.js](https://nextjs.org) 16                                 | App Router, server rendering, image optimization |
| [React](https://react.dev) 19                                    | UI                                               |
| [next-intl](https://next-intl.dev)                               | Locales, routing, and messages                   |
| [Tailwind CSS](https://tailwindcss.com) 4                        | Utility layer beside the studio stylesheet       |
| [Zod](https://zod.dev)                                           | Shared form schemas for the client and the API   |
| [React Hook Form](https://react-hook-form.com)                   | Form state                                       |
| [TanStack Query](https://tanstack.com/query)                     | Submission mutations                             |
| [Axios](https://axios-http.com)                                  | Browser requests to the form API                 |
| [Resend](https://resend.com)                                     | Transactional email                              |
| [React Email](https://react.email)                               | HTML mail templates                              |
| [TypeScript](https://www.typescriptlang.org)                     | Types                                            |
| [Vitest](https://vitest.dev)                                     | Unit and component tests                         |
| [ESLint](https://eslint.org) and [Prettier](https://prettier.io) | Lint and format                                  |

Analytics and speed insights come from Vercel’s packages and run only in the deployed app.

## Requirements

- Node.js 20.9 or newer
- npm

## Setup

```bash
npm install
cp .env.example .env
```

Set `RESEND_API_KEY` in `.env` before submitting a form locally. The key stays in `.env`. That file is gitignored.

```bash
npm run dev
```

The dev server starts at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command                 | What it does                             |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Start the development server             |
| `npm run build`         | Production build                         |
| `npm run start`         | Serve the production build               |
| `npm run lint`          | ESLint                                   |
| `npm run format`        | Write Prettier formatting                |
| `npm run format:check`  | Check formatting without writing         |
| `npm run typecheck`     | `tsc --noEmit`                           |
| `npm test`              | Vitest                                   |
| `npm run test:coverage` | Vitest with coverage                     |
| `npm run ci`            | Lint, format check, typecheck, and tests |

`npm run ci` is the check to run before opening a pull request.

## Routes

| Path             | Page                               |
| ---------------- | ---------------------------------- |
| `/`              | Home                               |
| `/cases`         | Batches                            |
| `/cases/[batch]` | One batch and its teams            |
| `/about`         | Story, values, mentors             |
| `/apply`         | Participant application            |
| `/partner`       | Partner enquiry                    |
| `/tr/...`        | Turkish versions of the same pages |

`/en` redirects to the unprefixed English URL. `/api/applications` and `/api/partners` accept `POST` JSON. `sitemap.xml` and `robots.txt` are generated.

## Content

Program copy that editors change lives in JSON, not in React components.

| File                                   | Contents                                                   |
| -------------------------------------- | ---------------------------------------------------------- |
| `content/site.json`                    | Contact addresses, application window, stats, social links |
| `content/batches.json`                 | Batches, teams, partners, members                          |
| `content/mentors.json`                 | Tracks and mentors                                         |
| `messages/en.json`, `messages/tr.json` | Interface copy. Keys stay in parallel.                     |

Interface strings go through next-intl. Batch, mentor, and site facts go through `src/lib/content.ts`.

Image fields in the JSON are paths such as `mentors/ada.jpg` or `partners/logo.svg`. The site requests them at `/content/images/...`, so the file belongs in `public/content/images/`. Leave `photo` or `logo` empty to show a name or initials instead.

The JSON shipped in this repo is sample content. Replace it before treating the site as the live program record. Content is imported at build time, so a change is visible after the next deploy.

## Forms

Both forms validate with one Zod schema on the client and again on the server. Field errors are short codes (`required`, `invalid`, `invalid_email`, `too_short`) that the UI maps to translated copy.

A hidden `website_url` field is a honeypot. A submission that fills it receives a success response and sends no mail.

Accepted submissions are rendered with React Email and delivered through Resend. The sender and recipient list are constants in `src/lib/mail.ts`. `RESEND_API_KEY` is the only mail secret, and it comes from the environment.

## Environment

| Variable               | Required         | Purpose                                                                           |
| ---------------------- | ---------------- | --------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Production       | Canonical origin for metadata, sitemap, and the logo in email. No trailing slash. |
| `RESEND_API_KEY`       | For sending mail | Resend API key                                                                    |

If `NEXT_PUBLIC_SITE_URL` is unset, the site uses `https://$VERCEL_URL` on Vercel and `http://localhost:3000` locally.

## Project layout

```
src/app/[locale]     pages
src/app/api          form endpoints
src/components       UI
src/hooks            form mutations
src/lib              content, validation, mail, SEO
src/lib/email        React Email templates
src/i18n             locale routing
content              editable program data
messages             interface translations
public/images        brand and photography
tests                Vitest
```

## Deployment

The production target is Vercel. Pushing the connected branch builds the app, applies the production security headers from `next.config.ts`, and reads environment variables from the project settings.

Set `NEXT_PUBLIC_SITE_URL` and `RESEND_API_KEY` in the Vercel project before promoting a deployment that should send mail or emit the public canonical URL.

## Security

Report vulnerabilities privately. See [SECURITY.md](SECURITY.md).

## License

Copyright 2026 Product Studio.

Licensed under the [Apache License, Version 2.0](LICENSE). You can use, modify, and distribute this project under those terms.
