import express, { Request, Response } from "express";
import arcjet, { detectBot } from "../lib/arcjet";

const router = express.Router();

// Opt out of caching
router.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// Add rules to the base Arcjet instance outside of the handler function
const aj = arcjet.withRule(
  detectBot({
    mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
    // configured with a list of bots to allow from
    // https://arcjet.com/bot-list
    allow: [], // blocks all automated clients
  }),
);

router.get("/test", async (req: Request, res: Response) => {
  const fingerprint = req.ip!;

  const decision = await aj.protect(req, { fingerprint });

  console.log("Arcjet decision: ", decision);

  // If the decision is denied, return a 403 Forbidden response. You can inspect
  // the decision results to customize the response.
  if (decision.isDenied()) {
    return res.status(403).json({
      error: "HTTP 403: Forbidden.",
      ip: decision.ip,
    });
  }

  res.json({ message: "Hello world" });
});

router.get("/", async (req: Request, res: Response) => {
  const siteKey = process.env.ARCJET_KEY ? true : undefined;

  res.render("bots", {
    siteKey,
    title: "Arcjet bot protection example",
    description: "An example of Arcjet's bot protection.",
  });
});

export default router;
