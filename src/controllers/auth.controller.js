import boom from "@hapi/boom";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateTokens, verifyRefreshToken } from "../utils/jwt.js";
import RefreshToken from "../models/RefreshToken.js";

export const register = async (req, res) => {
  try {
    const { email, password, userName, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const boomError = boom.badRequest("User already exists");
      return res
        .status(boomError.output.statusCode)
        .json(boomError.output.payload);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      userName,
      password: hashedPassword,
      role,
    });

    const { accessToken, refreshToken } = generateTokens(user.id);

    await RefreshToken.create({
      token: refreshToken,
      UserId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
      },
    });

    console.log("User created successfully");
  } catch (error) {
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
    console.error(error);
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      const boomError = boom.badRequest("Invalid email or password");
      return res
        .status(boomError.output.statusCode)
        .json(boomError.output.payload);
    }

    const validPadssword = await bcrypt.compare(password, user.password);
    if (!validPadssword) {
      const boomError = boom.badRequest("Invalid email or password");
      return res
        .status(boomError.output.statusCode)
        .json(boomError.output.payload);
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    await RefreshToken.create({
      token: refreshToken,
      UserId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
      },
    });
    console.log("User logged in successfully");
  } catch (error) {
    console.error("error in login", error);
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const decoded = verifyRefreshToken(refreshToken);

    const tokenDoc = await RefreshToken.findOne({
      where: {
        token: refreshToken,
        UserId: decoded.id,
      },
    });

    if (!tokenDoc) {
      const boomError = boom.unauthorized("Invalid refresh token");
      return res
        .status(boomError.output.statusCode)
        .json(boomError.output.payload);
    }

    const { accessToken: newAccesToken } = generateTokens(decoded.userId);

    res.status(201).json({
      accessToken: newAccesToken,
    });
  } catch (error) {
    console.error("error in refresh token", error);
    const boomError = boom.badRequest(error);
    res.status(boomError.output.statusCode).json(boomError.output.payload);
  }
};
