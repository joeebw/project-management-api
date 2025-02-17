import boom from "@hapi/boom";
import Project from "../models/Project.js";
import { formatDateForSQLite } from "../utils/date.util.js";
import { formatDateForProject } from "../utils/task.util.js";

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      order: [["startDate", "ASC"]],
    });
    const formmatedProjects = projects.map(
      ({ id, name, startDate, endDate }) => ({
        id,
        name,
        startDate: formatDateForProject(startDate),
        endDate: formatDateForProject(endDate),
      })
    );
    res.json(formmatedProjects);
  } catch (error) {
    const boomError = boom.badImplementation(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
  }
};

export const createProject = async (req, res) => {
  try {
    const { name, description, startDate, endDate } = req.body;
    const project = await Project.create({
      name,
      description,
      startDate: formatDateForSQLite(startDate),
      endDate: formatDateForSQLite(endDate),
    });
    console.log("Project created successfully");
    res.status(201).json({ id: project.id });
  } catch (error) {
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.query;
    const project = await Project.findByPk(id);
    if (!project) {
      const boomError = boom.notFound("Project not found");
      return res
        .status(boomError.output.statusCode)
        .json(boomError.output.payload);
    }
    await Project.destroy({ where: { id } });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.query;
    const updates = req.body;

    if (updates.startDate) {
      updates.startDate = formatDateForSQLite(updates.startDate);
    }
    if (updates.endDate) {
      updates.endDate = formatDateForSQLite(updates.endDate);
    }

    const project = await Project.findByPk(id);
    if (!project) {
      const boomError = boom.notFound("Project not found");
      return res
        .status(boomError.output.statusCode)
        .json(boomError.output.payload);
    }
    await Project.update(updates, { where: { id } });
    res.json({ message: "Project updated successfully" });
  } catch (error) {
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
  }
};
