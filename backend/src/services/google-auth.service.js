const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

async function verifyGoogleIdToken(idToken) {
  if (!idToken) {
    throw new Error("Google sign-in token is required");
  }

  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
  );

  const payload = await response.json();

  if (!response.ok) {
    throw new Error("Invalid Google sign-in token");
  }

  if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
    throw new Error("Google sign-in is not configured for this application");
  }

  if (!["accounts.google.com", "https://accounts.google.com"].includes(payload.iss)) {
    throw new Error("Invalid Google token issuer");
  }

  if (payload.email_verified !== "true") {
    throw new Error("Your Google email must be verified");
  }

  if (!payload.email) {
    throw new Error("Google did not provide an email address");
  }

  return payload;
}

async function googleLoginUser(idToken) {
  const googleUser = await verifyGoogleIdToken(idToken);
  const email = googleUser.email.trim().toLowerCase();
  const name = googleUser.name?.trim() || email.split("@")[0];

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const randomPassword = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    success: true,
    message: "Google sign-in successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

module.exports = {
  googleLoginUser,
};
