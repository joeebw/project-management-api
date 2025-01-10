import express from "express";
import { register, refresh, signIn } from "../controllers/auth.controller.js";

export const router = express.Router();

router.post("/", register);
router.post("/signIn", signIn);
router.post("/refresh", refresh);
