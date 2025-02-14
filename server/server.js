require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const basicRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const translationsRoutes = require('./routes/translations');
const i18next = require('./i18n');
const i18nextMiddleware = require('i18next-http-middleware');

console.log('Starting server...');

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL variable in .env missing.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS with specific options
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add i18next middleware
app.use(i18nextMiddleware.handle(i18next));

// Pretty-print JSON responses
app.enable('json spaces');
// We want to be consistent with URL paths
app.enable('strict routing');

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error(`Database connection error: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  });

console.log('Database connection attempt completed');

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Routes
app.use('/', basicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stocks', require('./routes/stocks'));
app.use('/api/translations', translationsRoutes);

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).json({ message: req.t("resourceNotFound", "Resource not found") });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).json({ message: req.t("internalServerError", "Internal server error") });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Server startup complete');
});