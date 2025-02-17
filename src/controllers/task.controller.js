import boom from "@hapi/boom";
import Task from "../models/Task.js";
import { Op } from "sequelize";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import {
  formatDate,
  formatStatus,
  getFormmatedTasks,
  normaliceStatusFormatting,
} from "../utils/task.util.js";
import sequelize from "../config/database.js";
import Project from "../models/Project.js";
import { formatDateForSQLite } from "../utils/date.util.js";

export const getTasks = async (req, res) => {
  try {
    const { id, section = "board" } = req.query;

    if (!id) {
      const boomError = boom.badRequest("Project ID is required");
      return res
        .status(boomError.output.statusCode)
        .json(boomError.output.payload);
    }

    const project = await Project.findByPk(id);
    if (!project) {
      const boomError = boom.notFound("Project not found");
      return res
        .status(boomError.output.statusCode)
        .json(boomError.output.payload);
    }

    let tasks = await Task.findAll({ where: { ProjectId: id } });

    const commentCounts = await Comment.findAll({
      attributes: [
        "TaskId",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["TaskId"],
      raw: true,
    });

    const userIds = [...new Set(tasks.flatMap((task) => task.assignees))];
    const users = await User.findAll({
      where: { id: userIds },
      attributes: ["id", "userName"],
    });

    tasks = tasks.map((task) => ({
      ...task.toJSON(),
      hasComments: commentCounts.some((cc) => cc.TaskId === task.id),
    }));

    if (section === "board") {
      tasks = getFormmatedTasks(tasks, users);
    }

    if (section === "list") {
      tasks = tasks.map((task) => {
        const assigneeNames = task.assignees.map((assigneeId) => {
          const user = users.find((user) => user.id === assigneeId);
          return user ? user.userName : "Unknown User";
        });

        return {
          id: task.id,
          title: task.title,
          description: task.description,
          status: formatStatus(task.status),
          tags: task.tags,
          startDate: formatDate(task.start_date),
          endDate: formatDate(task.end_date),
          assignees: assigneeNames,
          priority: task.priority,
          hasComments: task.hasComments,
        };
      });
    }

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
      where: sequelize.literal(
        `json_array_length(assignees) > 0 AND json_extract(assignees, '$') LIKE '%${id}%'`
      ),
    });

    const tasksFormatted = tasks.map((task) => {
      return {
        id: task.id,
        title: task.title,
        status: formatStatus(task.status),
        priority: task.priority,
        endDate: formatDate(task.end_date),
      };
    });

    res.status(200).json(tasksFormatted);
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
    const completedTasks = await Task.count({ where: { status } });
    const remainingTasks = await Task.count({
      where: {
        status: {
          [Op.in]: ["to_do", "work_in_progress", "under_review"],
        },
      },
    });

    const result = [
      { name: "completed", value: completedTasks },
      { name: "remaining", value: remainingTasks },
    ];

    res.status(200).json(result);
  } catch (error) {
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
    console.error(error);
  }
};

export const getTasksPriorityCount = async (req, res) => {
  try {
    const taskCounts = await Task.findAll({
      attributes: [
        "priority",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["priority"],
      raw: true,
    });

    const result = taskCounts.map((item) => {
      return { name: item.priority, value: parseInt(item.count) };
    });

    res.status(200).json(result);
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
      startDate,
      endDate,
      assignedUserIds,
      projectId,
      tags,
      status,
      priority,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      start_date: formatDateForSQLite(startDate),
      end_date: formatDateForSQLite(endDate),
      assignees: assignedUserIds,
      ProjectId: projectId,
      status: normaliceStatusFormatting(status),
      tags: tags,
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
      updates.status = normaliceStatusFormatting(updates.status);
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
    const { id: userId } = req.user;
    const { comment, taskId } = req.body;

    const user = await User.findByPk(userId);

    const newComment = await Comment.create({
      text: comment,
      UserId: userId,
      TaskId: taskId,
    });

    res.status(200).json({
      id: newComment.id,
      text: newComment.text,
      userName: user.userName,
    });
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
      order: [["createdAt", "ASC"]],
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
