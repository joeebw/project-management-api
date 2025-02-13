import express from "express";
import {
  getAllUsers,
  getUser,
  removeUser,
  updateUserProfile,
} from "../controllers/user.controller.js";

import { authenticateToken } from "../middleware/auth.js";

export const router = express.Router();

router.get("/get-user", authenticateToken, getUser);
router.get("/all-users", authenticateToken, getAllUsers);
router.put("/update-profile", authenticateToken, updateUserProfile);
router.delete("/remove-user", authenticateToken, removeUser);
