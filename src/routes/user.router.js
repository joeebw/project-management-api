import express from "express";
import {
  getAllUsers,
  removeUser,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { authenticateToken } from "../middleware/auth.js";

export const router = express.Router();

router.get("/all-users", authenticateToken, getAllUsers);
router.put("/update-profile", authenticateToken, updateUserProfile);
router.delete("/remove-user", authenticateToken, removeUser);
