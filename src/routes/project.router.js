import express from "express";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../controllers/project.controller.js";
import { authenticateToken } from "../middleware/auth.js";

export const router = express.Router();

router.get("/", authenticateToken, getProjects);
router.post("/create", authenticateToken, createProject);
router.delete("/delete", authenticateToken, deleteProject);
router.put("/update", authenticateToken, updateProject);
