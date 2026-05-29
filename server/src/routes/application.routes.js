const express = require("express");

const router = express.Router();

const controller = require("../controllers/application.controller");

const authMiddleware = require("../middlewares/auth.middleware");

const roleMiddleware = require("../middlewares/role.middleware");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.getAll,
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("CANDIDATE"),
  controller.create,
);

router.get(
  "/my-applications",
  authMiddleware,
  roleMiddleware("CANDIDATE"),
  controller.getMyApplications,
);

router.get("/public/lookup", controller.publicLookup);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("CANDIDATE", "ADMIN"),
  controller.getDetail,
);

router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  controller.updateStatus,
);

module.exports = router;
