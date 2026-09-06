const prisma = require("../config/prisma");

async function requireAdmin(req, res, next) {
  try {
    if (!req.user?.userId) {
      return res.status(403).json({
        success: false,
        message: "Administrator access required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Administrator access required",
      });
    }

    req.user.role = user.role;
    return next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Administrator access required",
    });
  }
}

module.exports = requireAdmin;
