import RefreshToken from "../models/RefreshToken.js";
import User from "../models/User.js";
import boom from "@hapi/boom";

export const getUser = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findByPk(id);
    res.status(200).json({
      email: user.email,
      userName: user.userName,
      role: user.role,
    });
  } catch (error) {
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
    console.error(error);
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const updates = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      const boomError = boom.notFound("User not found");
      return res
        .status(boomError.output.statusCode)
        .json(boomError.output.payload);
    }
    await User.update(updates, { where: { id } });
    res.status(201).json({ message: "User updated succesfully" });
  } catch (error) {
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
    console.error(error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.findAll();
    const formmatedUsers = allUsers.map(({ id, userName }) => {
      return {
        id,
        userName,
        profilePicture: userName,
      };
    });
    res.status(200).json(formmatedUsers);
  } catch (error) {
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
    console.error(error);
  }
};

export const removeUser = async (req, res) => {
  try {
    const { id } = req.query;
    await RefreshToken.destroy({ where: { UserId: id } });
    await User.destroy({ where: { id } });
    res.status(201).json({ message: "User removed susccesfully" });
  } catch (error) {
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
    console.error(error);
  }
};
