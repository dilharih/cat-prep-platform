const express = require("express");
const authenticate = require("../middleware/auth.middleware");
const requireAdmin = require("../middleware/admin.middleware");
const {
  listMockTests,
  getMockTest,
  create,
  update,
  remove,
} = require("../controllers/admin-mockTest.controller");

const router = express.Router();

router.get("/access", authenticate, requireAdmin, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Administrator access granted",
    user: req.user,
  });
});

router.use(authenticate, requireAdmin);

router.get("/mock-tests", listMockTests);
router.get("/mock-tests/:id", getMockTest);
router.post("/mock-tests", create);
router.patch("/mock-tests/:id", update);
router.delete("/mock-tests/:id", remove);

module.exports = router;
