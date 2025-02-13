import express from "express";
import {
  register,
  refresh,
  signIn,
  signInGuest,
} from "../controllers/auth.controller.js";
import { validateRegister } from "../middleware/validateRegister.js";

export const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/signIn", signIn);
router.post("/signInGuest", signInGuest);
router.post("/refresh", refresh);
