const express = require("express");

const {
  listMockTests,
  getMockTest,
  create,
  update,
  remove,
} = require("../controllers/admin-mockTest.controller");
const authenticate = require("../middleware/auth.middleware");
const requireAdmin = require("../middleware/admin.middleware");

const router = express.Router();

router.use(authenticate, requireAdmin);

router.get("/", listMockTests);
router.get("/:id", getMockTest);
router.post("/", create);
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;
