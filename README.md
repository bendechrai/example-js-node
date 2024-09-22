<a href="https://arcjet.com" target="_arcjet-home">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://arcjet.com/logo/arcjet-dark-lockup-voyage-horizontal.svg">
    <img src="https://arcjet.com/logo/arcjet-light-lockup-voyage-horizontal.svg" alt="Arcjet Logo" height="128" width="auto">
  </picture>
</a>

# Arcjet on Node and Express example app

[Arcjet](https://arcjet.com) helps developers protect their apps in just a few
lines of code. This is an example application demonstrating the use of multiple
features.

## Features

- [Signup form protection](https://example.arcjet.com/signup) uses Arcjet's
  server-side email verification configured to block disposable providers and
  ensure that the domain has a valid MX record. It also includes rate limiting
  and bot protection to prevent automated abuse.
- [Bot protection](https://example.arcjet.com/bots) shows how a page can be
  protected from automated clients.
- [Rate limiting](https://example.arcjet.com/rate-limiting) shows the use of
  different rate limit configurations depending on the authenticated user. A
  logged-in user can make more requests than an anonymous user.
- [Attack protection](https://example.arcjet.com/attack) demonstrates Arcjet
  Shield, which detects suspicious behavior, such as SQL injection and
  cross-site scripting attacks.
- [Sensitive Info](https://example.arcjet.com/sensitive-info) shows how your
  application can be protected from ever receiving sensitive information.

## Run locally

1. [Register for a free Arcjet account](https://app.arcjet.com).

2. Install dependencies:

```bash
npm ci
```

3. Rename `.env.local.example` to `.env.local` and add your Arcjet key. If you
   want to test the rate limiting authentication, you will also need to add
   `AUTH_SECRET`, `GITHUB_CLIENT_ID`, and `GITHUB_CLIENT_SECRET`.

   > Get your GitHub variables by [creating a GitHub OAuth
   > app](https://github.com/settings/developers) with a callback URL of
   > `http://localhost:3000/auth/callback/github`.

4. Start the dev server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Stack

- Auth: [Auth.js](https://authjs.dev/)
- App: [Node.js](https://nodejs.org/) and [Expreess](https://expressjs.com/)
- Development: [TypeScript](https://www.typescriptlang.org/) and [tsx](https://github.com/esbuild-kit/tsx)
- Server-side validation: [Zod](https://zod.dev/)
- Security: [Arcjet](https://arcjet.com/)
