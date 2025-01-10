import express from "express";
import {
  createTask,
  deleteTask,
  getMyTasks,
  getTasks,
  getTasksPriorityCount,
  getTotalTasks,
  updateTask,
} from "../controllers/task.controller.js";

export const router = express.Router();

router.get("/", getTasks);
router.get("/my-tasks", getMyTasks);
router.get("/tasks-count", getTasksPriorityCount);
router.get("/total-tasks", getTotalTasks);
router.post("/create", createTask);
router.delete("/delete", deleteTask);
router.put("/update", updateTask);
