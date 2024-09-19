import express from "express";
import path from "path";
import passport from "passport";
import expressEjsLayouts from "express-ejs-layouts";
import { sessionMiddleware, addAuthRoutes } from "./lib/auth";
import signupProtectionRouter from "./routes/signup";
import botProtectionRouter from "./routes/bots";
import rateLimitingRouter from "./routes/rate-limiting";
import attackProtectionRouter from "./routes/attack";

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

// Serve static files from src/public (for other static assets)
app.use(express.static(path.join(__dirname, "public")));

// Serve static files from dist/public (for the generated tailwind.css)
app.use(express.static(path.join(__dirname, "..", "dist", "public")));

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Pass variables to all views
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.siteKey = process.env.ARCJET_KEY ? true : undefined;
  res.locals.currentUrl = req.originalUrl;
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "Arcjet example app",
  });
});

app.get("/welcome", (req, res) => {
  res.render("welcome", {
    title: "Arcjet Signup Welcome Page",
  });
});

app.use("/signup", signupProtectionRouter);
app.use("/bots", botProtectionRouter);
app.use("/rate-limiting", rateLimitingRouter);
app.use("/attack", attackProtectionRouter);

app.get("/sensitive-info", (req, res) => {
  res.render("sensitive-info", {
    title: "Sensitive Info",
  });
});

// Add authentication routes
addAuthRoutes(app);

export default app;
