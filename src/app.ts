import express from "express";
import path from "path";
import passport from "passport";
import expressEjsLayouts from "express-ejs-layouts";
import rateLimitingRouter from "./routes/rate-limiting";
import { sessionMiddleware, addAuthRoutes } from "./lib/auth";

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

// Pass user and siteKey to all views
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.siteKey = process.env.ARCJET_KEY ? true : undefined;
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "Arcjet example app",
    currentUrl: req.originalUrl,
  });
});

app.get("/signup", (req, res) => {
  res.render("signup", {
    title: "Signup form protection",
    currentUrl: req.originalUrl,
  });
});

app.get("/bots", (req, res) => {
  res.render("bots", {
    title: "Bot protection",
    currentUrl: req.originalUrl,
  });
});

app.use("/rate-limiting", rateLimitingRouter);

app.get("/attack", (req, res) => {
  res.render("attack", {
    title: "Attack protection",
    currentUrl: req.originalUrl,
  });
});

app.get("/sensitive-info", (req, res) => {
  res.render("sensitive-info", {
    title: "Sensitive Info",
    currentUrl: req.originalUrl,
  });
});

// Add authentication routes
addAuthRoutes(app);

export default app;
