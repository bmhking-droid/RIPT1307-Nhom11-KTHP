const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.get("/me", authMiddleware, userController.getProfile);
router.get("/", authMiddleware, roleMiddleware("ADMIN"), userController.getAllUsers);
router.patch("/:id/toggle-status", authMiddleware, roleMiddleware("ADMIN"), userController.toggleUserStatus);

module.exports = router;
