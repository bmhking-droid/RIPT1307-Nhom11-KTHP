const express = require("express");

const router = express.Router();

const controller = require("../controllers/major.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const roleMiddleware = require("../middlewares/role.middleware");

router.get("/", controller.getAll);

router.post("/", authMiddleware, roleMiddleware("ADMIN"), controller.create);

router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), controller.update);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.delete,
);

module.exports = router;
