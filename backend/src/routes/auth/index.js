import express from "express";
import {
  forgotPasswordRouteHandler,
  loginRouteHandler,
  registerRouteHandler,
  resetPasswordRouteHandler,
} from "../../services/auth/index.js";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  const { NIN, password } = req.body;
  await loginRouteHandler(req, res, NIN, password);
});

router.post("/logout", (req, res) => {
  return res.sendStatus(204);
});

router.post("/register", async (req, res) => {
  const { name, userId, email, password, course, group, isGroupLeader } = req.body;
  await registerRouteHandler(req, res, name, userId, email, password, course, group, isGroupLeader);
});

router.post("/password-forgot", async (req, res) => {
  const { email } = req.body;
  await forgotPasswordRouteHandler(req, res, email);
});

router.post("/password-reset", async (req, res) => {
  await resetPasswordRouteHandler(req, res);
});

export default router;
