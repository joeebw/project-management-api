import express from "express";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../controllers/project.controller.js";

export const router = express.Router();

router.get("/", getProjects);
router.post("/create", createProject);
router.delete("/delete", deleteProject);
router.put("/update", updateProject);
