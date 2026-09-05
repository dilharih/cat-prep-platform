const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const questionRoutes = require("./routes/question.routes");
const attemptRoutes = require("./routes/attempt.routes");
const mockTestRoutes = require("./routes/mockTest.routes");
const mockTestAttemptRoutes = require("./routes/mockTestAttempt.routes");
const mockTestResultRoutes = require("./routes/mockTestResult.routes");
const {
  setSecurityHeaders,
  validateOrigin,
} = require("./middleware/security.middleware");
const { ensureCsrfCookie } = require("./utils/auth.utils");

const app = express();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(setSecurityHeaders);
app.use(requestIdMiddleware);
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-CSRF-Token"],
  })
);
app.use(validateOrigin);
app.use(express.json({ limit: "50kb" }));
app.use(ensureCsrfCookie);

app.use("/api/attempts", attemptRoutes);
app.use("/api/mock-test-results", mockTestResultRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/mock-tests", mockTestRoutes);
app.use("/api/mock-test-attempts", mockTestAttemptRoutes);

function requestIdMiddleware(req, res, next) {
  const id = require("crypto").randomUUID();
  res.setHeader("X-Request-ID", id);
  next();
}

module.exports = app;
