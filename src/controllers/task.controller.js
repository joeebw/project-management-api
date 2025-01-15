import boom from "@hapi/boom";
import Task from "../models/Task.js";
import { Op } from "sequelize";

export const getTasks = async (req, res) => {
  try {
    const { id } = req.query;
    const tasks = await Task.findAll({ where: { ProjectId: id } });

    res.status(200).json(tasks);
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
      comments: [],
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
    await Task.update(updates, { where: { id } });
    res.status(200).json({ message: "Task updated successfully" });
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
