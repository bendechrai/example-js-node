import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import expressEjsLayouts from "express-ejs-layouts";

import signupProtectionRouter from "./routes/signup";
import botProtectionRouter from "./routes/bots";
import rateLimitingRouter from "./routes/rate-limiting";
import attackProtectionRouter from "./routes/attack";
import sensitiveInfoRouter from "./routes/sensitive-info";

import { auth, authSession } from "./lib/auth";

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set up EJS layouts
app.use(expressEjsLayouts);
app.set("layout", "layout"); // This sets layout.ejs as the default layout

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "..", "dist", "public")));

// Auth.js setup
app.use("/auth/*", auth);
app.use(authSession);

// Pass variables to all views
app.use((req, res, next) => {
  res.locals.siteKey = process.env.ARCJET_KEY ? true : undefined;
  res.locals.currentUrl = req.originalUrl;
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Arcjet example app" });
});

app.get("/welcome", (req, res) => {
  res.render("welcome", { title: "Arcjet Signup Welcome Page" });
});

app.use("/signup", signupProtectionRouter);
app.use("/bots", botProtectionRouter);
app.use("/rate-limiting", rateLimitingRouter);
app.use("/attack", attackProtectionRouter);
app.use("/sensitive-info", sensitiveInfoRouter);

export default app;
