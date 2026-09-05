const crypto = require("crypto");

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
const requestBuckets = new Map();

const limits = {
  login: { windowMs: 15 * 60 * 1000, max: 10 },
  signup: { windowMs: 60 * 60 * 1000, max: 8 },
  general: { windowMs: 60 * 1000, max: 120 },
};

function setSecurityHeaders(req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");

  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  next();
}

function validateOrigin(req, res, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  const origin = req.get("Origin");

  if (origin && origin !== allowedOrigin) {
    return res.status(403).json({
      success: false,
      message: "Request origin is not allowed",
    });
  }

  return next();
}

function createRateLimiter(type) {
  const config = limits[type] || limits.general;

  return (req, res, next) => {
    const now = Date.now();
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const key = `${type}:${ip}`;
    const current = requestBuckets.get(key);

    if (!current || now - current.startedAt >= config.windowMs) {
      requestBuckets.set(key, { startedAt: now, count: 1 });
      return next();
    }

    current.count += 1;

    if (current.count > config.max) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
    }

    return next();
  };
}

function cleanupRateLimitBuckets() {
  const now = Date.now();

  for (const [key, bucket] of requestBuckets.entries()) {
    if (now - bucket.startedAt > 60 * 60 * 1000) {
      requestBuckets.delete(key);
    }
  }
}

setInterval(cleanupRateLimitBuckets, 10 * 60 * 1000).unref();

function generateRequestId() {
  return crypto.randomUUID();
}

function requestId(req, res, next) {
  const id = req.get("X-Request-ID") || generateRequestId();
  res.setHeader("X-Request-ID", id);
  next();
}

module.exports = {
  setSecurityHeaders,
  validateOrigin,
  createRateLimiter,
  requestId,
};
