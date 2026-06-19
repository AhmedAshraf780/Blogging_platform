import { Request, Response } from "express";
import { getUserByEmail, insertUser } from "../database/repositories/user.repo";
import { generateOTP, sendOTPEmail } from "../utils/otp";
import { v4 as uuidv4 } from 'uuid';
import { redis } from "../config/redis";
import bcrypt from "bcrypt";
import config from "../config/config";
import jwt from "jsonwebtoken";

/**
@swagger
/auth/register:
post:
summary: Register a new user and send OTP
tags: [Auth]
requestBody:
  required: true
  content:
   application/json:
     schema:
        type: object
        required:
          - name
          - email
          - password
        properties:
          name:
            type: string
            example: Ahmed
          email:
            type: string
            format: email
            example: ahmed@gmail.com
          password:
           type: string
           example: MyPassword123
responses:
  201:
    description: OTP sent successfully
    content:
      application/json:
        schema:
          type: object
          properties:
            message:
              type: string
              example: Otp sent successfully
            session_id:
              type: string
              example: b550eb14-c9f6-4c2e-a67c-45834f8292f2

  400:
    description: User already exists
  500:
    description: Server error
*/
export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  try {
    // validation of input
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // bcrypt password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await insertUser({ name, email, password: hashedPassword });
    if (!user) {
      return res.status(500).json({ message: "Server Error" });
    }

    // // generate otp
    // const otp = generateOTP();
    // const ok = await sendOTPEmail(email, otp);
    // if (!ok) {
    //   return res.status(500).json({ message: "Couldn't send otp to the email" })
    // }

    // // create a redis session
    // const sessionData = {
    //   name,
    //   email,
    //   password,
    //   otp
    // }
    // const session_id = uuidv4();
    // await redis.set(session_id, JSON.stringify(sessionData));
    return res.status(201).json({ message: "User created Successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
}
/**
@swagger
/api/v1/auth/validateotp:
post:
summary: validate otp and session_id
tags: [Auth]
requestBody:
  required: true
  content:
   application/json:
     schema:
        type: object
        required:
          - otp
          - session_id
        properties:
          otp:
            type: string
          session_id:
           type: string
responses:
  201:
    description: Otp is valid and user created successfully
    content:
      application/json:
        schema:
          type: object
          properties:
            message:
              type: string
  404:
    description: session not found, user didn't try to register
  400:
    description: otp is incorrect
  500:
    description: Server error
*/
export async function validateOTP(req: Request, res: Response) {
  const { otp, session_id } = req.body;
  try {
    const sessionData = await redis.get(session_id);
    if (!sessionData) {
      return res.status(404).json({ message: "Session not found" });
    }
    const session = JSON.parse(sessionData);
    if (session.otp !== otp) {
      return res.status(400).json({ message: "Otp is invalid" });
    }
    // insert the user in the database
    // bcrypt password
    const hashedPassword = await bcrypt.hash(session.password, 10);
    const user = await insertUser({ name: session.name, email: session.email, password: hashedPassword });
    if (!user) {
      return res.status(500).json({ message: "Server Error" });
    }
    return res.status(201).json({ message: "Otp is valid" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
}

/**
@swagger
/api/v1/auth/login:
post:
summary: login a registered user
tags: [Auth]
requestBody:
  required: true
  content:
   application/json:
     schema:
        type: object
        required:
          - email
          - password
        properties:
          email:
            type: string
            format: email
            example: ahmed@gmail.com
          password:
           type: string
           example: MyPassword123
responses:
  200:
    description: user validated successfully
    content:
      application/json:
        schema:
          type: object
          properties:
            message:
              type: string
  404:
    description: User not found
  401:
    description: User UnAuthorized
  500:
    description: Server error
*/
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // generate token
    const token = jwt.sign({ user_id: user.id }, config.jwt_secret, { expiresIn: "1h" });
    res.cookie(config.auth_token, token,
      {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 3600 * 1000
      }
    )
    return res.status(200).json({
      message: "Logged In", user: {
        id: user.id,
        name: user.name,
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
}