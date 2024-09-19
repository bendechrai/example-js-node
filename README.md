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
   want to test the rate limiting authentication, you will also need to add a
   `SESSION_SECRET` and [create a GitHub OAuth app](https://github.com/settings/developers).

4. Install Node 22. This code-base uses `--experimental-require-module` to allow
   intercompatibility between CommonJS and ESM. If you want an easy way to switch
   between Node versions, [Node Version manager](https://github.com/nvm-sh/nvm)
   is a great way to manage this.

5. Start the dev server

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Stack

@TBC

- Auth: [Auth.js](https://authjs.dev/)
- App: [Next.js](https://nextjs.org/)
- UI: [shadcn/ui](https://ui.shadcn.com/)
- Form handling: [React Hook Form](https://react-hook-form.com/) (see also [our
  full form protection
  example](https://github.com/arcjet/arcjet-js/tree/main/examples/nextjs-14-react-hook-form))
- Client-side validation: [Zod](https://zod.dev/)
- Security: [Arcjet](https://arcjet.com/)
- Platform: [Vercel](https://vercel.com/) (see [our integration](https://vercel.com/integrations/arcjet))
