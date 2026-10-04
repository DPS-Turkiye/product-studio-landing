# Security policy

Product Studio takes reports about this website seriously. Please send them privately so we can fix the issue before it is public.

## Reporting

Email [info@dpsturkiye.com](mailto:info@dpsturkiye.com).

Include:

- the affected URL or endpoint
- what you expected and what happened
- the steps to reproduce, and any request or response that helps
- the impact you believe it has

Please give us a chance to respond before disclosing the report publicly. We acknowledge valid reports and will follow up with a fix or an explanation.

Do not include exploits, payloads, or credentials in an issue, pull request, or chat that other people can read. Do not access data that is not yours, and do not disrupt the site to prove a point.

## Scope

In scope:

- [productstudio.com.tr](https://productstudio.com.tr) and its Vercel deployment
- `/api/applications` and `/api/partners`
- authentication of outbound mail and handling of the Resend API key

Out of scope:

- social-engineering of staff
- volumetric traffic that is already handled by the host
- findings in sample JSON under `content/`
- issues that require a vulnerable browser extension or a device that is already compromised

## What the application does

Production responses from `next.config.ts` send:

- `Strict-Transport-Security`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `Permissions-Policy` denying unused sensors, camera, microphone, and payment APIs
- `Content-Security-Policy: upgrade-insecure-requests`

These headers are applied when `NODE_ENV` is `production`.

Form bodies are parsed as JSON and checked with Zod before any mail is sent. A non-empty honeypot field (`website_url`) is accepted with an empty success response and is not emailed. The Resend API key is read from the environment and is not stored in the repository. `.env` files are gitignored; `.env.example` contains placeholders only.

The deployed project is also expected to use the Vercel firewall in front of the form routes. That control lives in the Vercel project, not in this source tree.

## Secrets

If a key is committed or pasted into a ticket, revoke it in Resend and replace `RESEND_API_KEY` in the Vercel project and in local `.env` files. Do not send the old key back to us in the report. Name the variable and where it appeared.
