import boom from "@hapi/boom";
import Task from "../models/Task.js";
import { Op } from "sequelize";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import {
  getFormmatedTasks,
  normaliceStatusFormatting,
} from "../utils/task.util.js";

export const getTasks = async (req, res) => {
  try {
    const { id } = req.query;
    const tasks = await Task.findAll({ where: { ProjectId: id } });
    const userIds = [...new Set(tasks.flatMap((task) => task.assignees))];
    const users = await User.findAll({
      where: { id: userIds },
      attributes: ["id", "userName"],
    });

    const formattedTasks = getFormmatedTasks(tasks, users);

    res.status(200).json(formattedTasks);
    console.log("Tasks fetched successfully");
  } catch (error) {
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
    console.error(error);
  }
};

export const getMyTasks = async (req, res) => {
  try {
    const { id } = req.user;
    const tasks = await Task.findAll({
      where: {
        assignees: {
          [Op.contains]: [id],
        },
      },
    });

    res.status(200).json(tasks);
    console.log("Tasks fetched successfully");
  } catch (error) {
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
    console.error(error);
  }
};

export const getTotalTasks = async (req, res) => {
  try {
    const { status = "completed" } = req.query;
    const totalTasks = await Task.count({ where: { status } });
    res.status(200).json({ totalTasks });
  } catch (error) {
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
    console.error(error);
  }
};

export const getTasksPriorityCount = async (req, res) => {
  try {
    const { priority } = req.query;
    const totalTasks = await Task.count({ where: { priority } });
    res.status(200).json({ totalTasks });
  } catch (error) {
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
    console.error(error);
  }
};

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      assignees,
      ProjectId,
      status,
      priority,
    } = req.body;
    const task = await Task.create({
      title,
      description,
      due_date: dueDate,
      assignees,
      ProjectId,
      status: status,
      tags: [],
      priority,
    });
    res.status(201).json(task);
    console.log("Task created successfully");
  } catch (error) {
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
    console.error(error);
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.query;
    const task = Task.findByPk(id);
    if (!task) {
      const boomError = boom.notFound("Task not found");
      return res
        .status(boomError.output.statusCode)
        .json(boomError.output.payload);
    }
    await Task.destroy({ where: { id } });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.query;
    const updates = req.body;
    const task = await Task.findByPk(id);
    if (!task) {
      const boomError = boom.notFound("Task not found");
      return res
        .status(boomError.output.statusCode)
        .json(boomError.output.payload);
    }

    if (updates.status) {
      normaliceStatusFormatting(updates);
    }

    console.log("updates: ", updates);

    await Task.update(updates, { where: { id } });
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
  }
};

export const addComment = async (req, res) => {
  try {
    const { comment, userId, taskId } = req.body;
    await Comment.create({
      text: comment,
      UserId: userId,
      TaskId: taskId,
    });
    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
  }
};

export const getTaskComments = async (req, res) => {
  try {
    const { id } = req.query;

    const comments = await Comment.findAll({
      where: { TaskId: id },
      include: [
        {
          model: User,
          attributes: ["userName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formattedComments = comments.map((comment) => ({
      id: comment.id,
      text: comment.text,
      userName: comment.User.userName,
    }));

    res.status(200).json(formattedComments);
  } catch (error) {
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
  }
};

export const removeComment = async (req, res) => {
  try {
    const { id } = req.query;
    const comment = await Comment.findByPk(id);

    if (!comment) {
      const boomError = boom.notFound("Comment not found");
      return res
        .status(boomError.output.statusCode)
        .json(boomError.output.payload);
    }

    await Comment.destroy({ where: { id } });
    res.status(200).json({ message: "Comment removed" });
  } catch (error) {
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
  }
};

export const searchTasks = async (req, res) => {
  try {
    const { query, id } = req.query;
    const tasks = await Task.findAll({
      where: {
        ProjectId: id,
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${query}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${query}%`,
            },
          },
        ],
      },
    });
    res.status(200).json(tasks);
    console.log("Tasks fetched successfully");
  } catch (error) {
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
    console.error(error);
  }
};
