const express = require("express");
const authenticate = require("../middleware/auth.middleware");
const requireAdmin = require("../middleware/admin.middleware");

const router = express.Router();

router.get("/access", authenticate, requireAdmin, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Administrator access granted",
    user: req.user,
  });
});

module.exports = router;
