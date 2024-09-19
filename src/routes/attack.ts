import express, { Request, Response } from "express";
import arcjet, { shield } from "../lib/arcjet";

const router = express.Router();

// Opt out of caching
router.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// Add rules to the base Arcjet instance outside of the handler function
const aj = arcjet.withRule(
  // Shield detects suspicious behavior, such as SQL injection and cross-site
  // scripting attacks.
  shield({
    mode: "LIVE",
  }),
);

router.get("/test", async (req: Request, res: Response) => {
  // The protect method returns a decision object that contains information
  // about the request.
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

router.get("/", (req: Request, res: Response) => {
  const user = req.session.user;
  const siteKey = process.env.ARCJET_KEY ? true : undefined;

  res.render("attack", {
    user,
    siteKey,
    title: "Arcjet attack protection example",
    description: "An example of Arcjet's attack protection.",
  });
});

export default router;
