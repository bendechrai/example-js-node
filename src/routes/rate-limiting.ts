import express, { Request, Response } from "express";
import arcjet, { fixedWindow, shield } from "../lib/arcjet";
import { setRateLimitHeaders } from "@arcjet/decorate";

const router = express.Router();

// Opt out of caching
router.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// Add rules to the base Arcjet instance outside of the handler function
const aj = arcjet.withRule(
  shield({
    mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
  }),
);

// Returns ad-hoc rules depending on whether the user is authenticated
function getClient(user: Express.User | undefined) {
  if (user) {
    return aj.withRule(
      fixedWindow({
        mode: "LIVE",
        max: 5,
        window: "60s",
      }),
    );
  } else {
    return aj.withRule(
      fixedWindow({
        mode: "LIVE",
        max: 2,
        window: "60s",
      }),
    );
  }
}

router.post("/test", async (req: Request, res: Response) => {
  const user = req.session.user;

  console.log("User: ", user);

  // Use the user ID if the user is logged in, otherwise use the IP address
  const fingerprint = user?.id ?? req.ip!;

  const decision = await getClient(user).protect(req, {
    fingerprint,
  });

  console.log("Arcjet decision: ", decision);

  // Add rate limit info to the headers (optional)
  const headers = new Headers();
  setRateLimitHeaders(headers, decision);

  let message = "";
  let remaining = 0;

  if (decision.reason.isRateLimit()) {
    const reset = decision.reason.resetTime;
    remaining = decision.reason.remaining;

    if (reset === undefined) {
      message = "";
    } else {
      // Calculate number of seconds between reset Date and now
      const seconds = Math.floor((reset.getTime() - Date.now()) / 1000);
      const minutes = Math.ceil(seconds / 60);

      if (minutes > 1) {
        message = `Reset in ${minutes} minutes.`;
      } else {
        message = `Reset in ${seconds} seconds.`;
      }
    }
  }

  // If the decision is denied, return an error. You can inspect
  // the decision results to customize the response.
  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return res.status(429).json({
        error: `HTTP 429: Too many requests. ${message}`,
        ip: decision.ip,
      });
    } else {
      return res.status(403).json({ error: "Forbidden", ip: decision.ip });
    }
  }

  Object.entries(Object.fromEntries(headers)).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  res.json({
    message: `HTTP 200: OK. ${remaining} requests remaining. ${message}`,
  });
});

router.get("/", async (req: Request, res: Response) => {
  const user = req.session.user;
  const siteKey = process.env.ARCJET_KEY ? true : undefined;

  res.render("rate-limiting", {
    user,
    siteKey,
    title: "Arcjet rate limit example",
    description:
      "An example of Arcjet's rate limiting with different limits depending on authentication.",
  });
});

export = router;
