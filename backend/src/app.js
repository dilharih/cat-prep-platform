const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const questionRoutes = require("./routes/question.routes");
const attemptRoutes = require("./routes/attempt.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/attempts", attemptRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/questions", questionRoutes);
module.exports = app;