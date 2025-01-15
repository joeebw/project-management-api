import { check, validationResult } from "express-validator";

export const validateRegister = [
  check("email").isEmail().withMessage("Please enter a valid email address"),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),

  check("userName").notEmpty().withMessage("Username is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
