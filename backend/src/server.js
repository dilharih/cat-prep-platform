require("dotenv").config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be configured with at least 32 characters");
}

if (process.env.NODE_ENV === "production") {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be configured in production");
  }

  if (!process.env.FRONTEND_URL) {
    throw new Error("FRONTEND_URL must be configured in production");
  }

  let frontendUrl;

  try {
    frontendUrl = new URL(process.env.FRONTEND_URL);
  } catch {
    throw new Error("FRONTEND_URL must be a valid URL");
  }

  if (frontendUrl.protocol !== "https:") {
    throw new Error("FRONTEND_URL must use HTTPS in production");
  }
}

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
