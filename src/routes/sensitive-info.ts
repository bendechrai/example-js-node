import express, { Request, Response } from "express";
import arcjet, { sensitiveInfo } from "../lib/arcjet";
import { emailFormSchema } from "../lib/formSchema";
import { ArcjetSensitiveInfoReason } from "@arcjet/node";

const router = express.Router();

// Opt out of caching
router.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// Add rules to the base Arcjet instance outside of the handler function
const aj = arcjet.withRule(
  // Arcjet's sensitiveInfo rule protects against clients sending you
  // sensitive information such as PII that you do not wish to handle.
  sensitiveInfo({
    mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
    deny: ["EMAIL"], //"EMAIL", "CREDIT_CARD_NUMBER", "IP_ADDRESS", "PHONE_NUMBER"],
  }),
);

router.post("/test", async (req: Request, res: Response) => {
  const fingerprint = req.ip!;
  const decision = await aj.protect(req, { fingerprint });

  // Get a list of the sensitive information types that were found in the payload
  if (decision.isDenied()) {
    const foundTypes = [
      "EMAIL",
      "CREDIT_CARD_NUMBER",
      "IP_ADDRESS",
      "PHONE_NUMBER",
    ].filter((type) => {
      (decision.reason as ArcjetSensitiveInfoReason).denied.some(
        (denial) => denial.identifiedType === type,
      );
    });

    // Generate a message to inform the user of the sensitive information types found
    const message =
      "Payload found these sensitive information types: " +
      foundTypes.join(", ");

    return res.status(403).json({ message: message });
  }

  return res.json({ ok: true });
});

router.get("/", (req: Request, res: Response) => {
  const user = req.session.user;
  const siteKey = process.env.ARCJET_KEY ? true : undefined;

  res.render("sensitive-info", {
    user,
    siteKey,
    title: "Arcjet signup form protection example",
    description: "An example of Arcjet's signup form protection.",
  });
});

export default router;
