import express from "express";
import {
  createTask,
  deleteTask,
  getMyTasks,
  getTasks,
  getTasksPriorityCount,
  getTotalTasks,
  searchTasks,
  updateTask,
} from "../controllers/task.controller.js";
import { authenticateToken } from "../middleware/auth.js";

export const router = express.Router();

router.get("/", authenticateToken, getTasks);
router.get("/my-tasks", authenticateToken, getMyTasks);
router.get("/tasks-count", authenticateToken, getTasksPriorityCount);
router.get("/total-tasks", authenticateToken, getTotalTasks);
router.get("/search-tasks", authenticateToken, searchTasks);
router.post("/create", authenticateToken, createTask);
router.delete("/delete", authenticateToken, deleteTask);
router.put("/update", authenticateToken, updateTask);
