import { Router } from "express";
import { login, register, validateOTP } from "../controllers/auth.controllers";
import { body } from "express-validator";
import { getUserById } from "../database/repositories/user.repo";
const authRouter = Router();


authRouter.post("/register", [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
], register)

authRouter.post("/login",
    [
        body("email")
            .trim()
            .isEmail()
            .withMessage("Invalid email"),

        body("password")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters")
    ], login)
authRouter.post("/validateotp", [
    body("session_id")
        .trim()
        .isString()
        .withMessage("Invalid session id"),

    body("otp")
        .isLength({ min: 6, max: 6 })
        .withMessage("otp must be 6 numbers")
], validateOTP)

export default authRouter;