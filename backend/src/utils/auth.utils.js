const crypto = require("crypto");

const isProduction = process.env.NODE_ENV === "production";
const sessionCookieName = isProduction ? "__Host-session" : "session";
const csrfCookieName = isProduction ? "__Host-csrf" : "csrf_token";

function parseCookies(cookieHeader = "") {
  return cookieHeader.split(";").reduce((cookies, part) => {
    const index = part.indexOf("=");

    if (index === -1) {
      return cookies;
    }

    const key = part.slice(0, index).trim();
    const value = decodeURIComponent(part.slice(index + 1).trim());
    cookies[key] = value;
    return cookies;
  }, {});
}

function appendCookie(res, name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (options.maxAge !== undefined) {
    parts.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`);
  }

  parts.push(`Path=${options.path || "/"}`);
  parts.push(`SameSite=${options.sameSite || "Strict"}`);

  if (options.httpOnly) {
    parts.push("HttpOnly");
  }

  if (isProduction || options.secure) {
    parts.push("Secure");
  }

  const existing = res.getHeader("Set-Cookie");
  const cookies = Array.isArray(existing) ? existing : existing ? [existing] : [];
  cookies.push(parts.join("; "));
  res.setHeader("Set-Cookie", cookies);
}

function clearCookie(res, name) {
  appendCookie(res, name, "", {
    maxAge: 0,
    httpOnly: name === sessionCookieName,
    sameSite: "Strict",
  });
}

function setSessionCookie(res, token) {
  appendCookie(res, sessionCookieName, token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "Strict",
  });
}

function ensureCsrfCookie(req, res, next) {
  const cookies = parseCookies(req.headers.cookie);
  let token = cookies[csrfCookieName];

  if (!token) {
    token = crypto.randomBytes(32).toString("hex");
    appendCookie(res, csrfCookieName, token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: false,
      sameSite: "Strict",
    });
  }

  return next();
}

function requireCsrf(req, res, next) {
  const cookies = parseCookies(req.headers.cookie);
  const cookieToken = cookies[csrfCookieName];
  const headerToken = req.get("X-CSRF-Token");

  if (
    !cookieToken ||
    !headerToken ||
    cookieToken.length !== headerToken.length ||
    !crypto.timingSafeEqual(Buffer.from(cookieToken), Buffer.from(headerToken))
  ) {
    return res.status(403).json({
      success: false,
      message: "Request could not be verified",
    });
  }

  return next();
}

function getSessionToken(req) {
  const cookies = parseCookies(req.headers.cookie);
  return cookies[sessionCookieName] || null;
}

module.exports = {
  csrfCookieName,
  sessionCookieName,
  parseCookies,
  setSessionCookie,
  clearCookie,
  ensureCsrfCookie,
  requireCsrf,
  getSessionToken,
};
