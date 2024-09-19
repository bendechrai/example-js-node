import { Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import express from "express";

// Extend Express.User interface
declare global {
  namespace Express {
    interface User {
      id: string;
      email?: string;
    }
  }
}

// Extend session data
declare module "express-session" {
  interface SessionData {
    user?: Express.User;
  }
}

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
    },
    function (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (error: any, user?: Express.User) => void
    ) {
      const user: Express.User = {
        id: profile.id,
        email:
          profile.emails && profile.emails[0]
            ? profile.emails[0].value
            : undefined,
      };
      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj: Express.User, done) => {
  done(null, obj);
});

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "your-fallback-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === "production" },
});

export async function auth(req: Request): Promise<Express.User | null> {
  return req.session.user || null;
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
}

export function addAuthRoutes(app: express.Application) {
  app.post(
    "/auth/login",
    passport.authenticate("github", { scope: ["user:email"] })
  );

  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/rate-limiting" }),
    function (req: Request, res: Response) {
      if (req.user) {
        req.session.user = req.user;
      }
      res.redirect("/rate-limiting");
    }
  );

  app.post("/auth/signout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
      res.redirect("/rate-limiting");
    });
  });
}
