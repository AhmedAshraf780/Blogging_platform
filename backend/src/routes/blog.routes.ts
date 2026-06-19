import { Router } from "express";
import { insertBlog, DeleteBlog, fetchAllBlogs, fetchBlogById, UpdateBlog, fetchAllBlogsOfUser } from "../controllers/blog.controller";
import { body } from "express-validator";

const blogRouter = Router();
blogRouter.get("/", fetchAllBlogs)
blogRouter.get("/me", fetchAllBlogsOfUser)
blogRouter.post("/", [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 3 })
        .withMessage("Title must be at least 3 characters"),

    body("content")
        .trim()
        .notEmpty()
        .withMessage("Content is required"),

], insertBlog)
blogRouter.get("/:id", fetchBlogById)
blogRouter.put("/:id", [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 3 })
        .withMessage("Title must be at least 3 characters"),

    body("content")
        .trim()
        .notEmpty()
        .withMessage("Content is required"),

], UpdateBlog)
blogRouter.delete("/:id", DeleteBlog)
export default blogRouter;