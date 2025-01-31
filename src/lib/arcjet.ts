import arcjet, {
  detectBot,
  fixedWindow,
  protectSignup,
  shield,
} from "@arcjet/node";

// Re-export the rules to simplify imports inside handlers
export { detectBot, fixedWindow, protectSignup, shield };

// Create a base Arcjet instance for use by each handler
export default arcjet({
  key: process.env.ARCJET_KEY!,
  characteristics: ["fingerprint"],
  rules: [],
});
