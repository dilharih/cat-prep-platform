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

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/attempts", attemptRoutes);
app.use("/api/mock-test-results", mockTestResultRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/mock-tests", mockTestRoutes);
app.use("/api/mock-test-attempts", mockTestAttemptRoutes);

module.exports = app;