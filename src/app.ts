import express from 'express';
import path from 'path';
import passport from 'passport';
import rateLimitingRouter from './routes/rate-limiting';
import { sessionMiddleware, addAuthRoutes } from './lib/auth';

const app = express();

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Arcjet example app',
    user: req.user
  });
});

app.get('/signup', (req, res) => {
  res.render('signup', { 
    title: 'Signup form protection',
    user: req.user
  });
});

app.get('/bots', (req, res) => {
  res.render('bots', { 
    title: 'Bot protection',
    user: req.user
  });
});

app.use('/rate-limiting', rateLimitingRouter);

app.get('/attack', (req, res) => {
  res.render('attack', { 
    title: 'Attack protection',
    user: req.user
  });
});

app.get('/sensitive-info', (req, res) => {
  res.render('sensitive-info', { 
    title: 'Sensitive Info',
    user: req.user
  });
});

// Add authentication routes
addAuthRoutes(app);

export default app;