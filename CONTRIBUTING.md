# Contributing

This is the Product Studio website. Changes should leave `npm run ci` green.

## Setup

```bash
npm install
cp .env.example .env
```

Add a Resend key to `.env` only if you need to send a real message. Never commit `.env` or a live API key.

## Before a pull request

```bash
npm run ci
```

That runs ESLint, Prettier, the TypeScript check, and Vitest.

- Keep `messages/en.json` and `messages/tr.json` in the same shape.
- Put program facts in `content/`, and interface copy in `messages/`.
- Form rules belong in `src/lib/submissions.ts` so the browser and the API share one schema.
- Mail layout belongs in `src/lib/email/`. Sender and recipients belong in `src/lib/mail.ts`.

## Security issues

Do not file a public issue for a vulnerability. Use [SECURITY.md](SECURITY.md).
