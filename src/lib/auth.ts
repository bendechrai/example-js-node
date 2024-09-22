import { ExpressAuth, getSession } from "@auth/express";
import GitHub from "@auth/express/providers/github";
import { Request, Response, NextFunction } from "express";

export const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.AUTH_SECRET,
};

export const auth = ExpressAuth(authConfig);

export async function authSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.locals.session = await getSession(req, authConfig);
  next();
}
