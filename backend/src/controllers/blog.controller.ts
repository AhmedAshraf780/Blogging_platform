import { Request, Response } from "express";
import { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog, getBlogsOfUser } from "../database/repositories/blog.repo";
import { getUserById } from "../database/repositories/user.repo";
import { redis } from "../config/redis";
/**
@swagger
/blogs:
get:
summary: Retrieve all blogs of the user
tags: [Blogs]
responses:
  200:
    description: A list of all blogs that the user has created
    content:
      application/json:
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: string
              title:
                type: string
              content:
                type: string
              author_id:
                type: string
  500:
    description: Server error
*/
export async function fetchAllBlogsOfUser(req: Request, res: Response) {
    try {
        const cachedBlogs = await redis.get(`blogs:${req.user_id}`);
        if (cachedBlogs) {
            return res.status(200).json({ blogs: JSON.parse(cachedBlogs) });
        }
        const blogs = await getBlogsOfUser(req.user_id!);
        await redis.set(`blogs:${req.user_id}`, JSON.stringify(blogs), { "EX": 60 });
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
}


/**
@swagger
/blogs:
get:
summary: Retrieve all blogs
tags: [Blogs]
responses:
  200:
    description: A list of all blogs
    content:
      application/json:
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: string
              title:
                type: string
              content:
                type: string
              author_id:
                type: string
  500:
    description: Server error
*/
export async function fetchAllBlogs(req: Request, res: Response) {
    try {
        const cachedBlogs = await redis.get("blogs");
        if (cachedBlogs) {
            return res.status(200).json({ blogs: JSON.parse(cachedBlogs) });
        }
        const blogs = await getBlogs();
        await redis.set("blogs", JSON.stringify(blogs), { "EX": 60 * 2 });
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
}
/**
@swagger
/blogs/{id}:
get:
summary: Retrieve a blog by its ID
tags: [Blogs]
parameters:
  - in: path
    name: id
    required: true
    schema:
      type: string
    description: The blog ID
responses:
  200:
    description: A single blog object
    content:
      application/json:
        schema:
          type: object
          properties:
            id:
              type: string
            title:
              type: string
            content:
              type: string
            author_id:
              type: string
  400:
    description: Id is required
  404:
    description: Blog not found
  500:
    description: Server error
*/
export async function fetchBlogById(req: Request, res: Response) {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }

        const blog = await getBlogById(parseInt(id as string));
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
}
/**
@swagger
/blogs:
post:
summary: Create a new blog post
tags: [Blogs]
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required:
          - title
          - content
          - author_id
        properties:
          title:
            type: string
            example: My Blog Title
          content:
            type: string
            example: Blog content here
          author_id:
            type: string
            example: 550e8400-e29b-41d4-a716-446655440000
responses:
  201:
    description: Blog created successfully
  404:
    description: Author not found
  500:
    description: Server error
*/
export async function insertBlog(req: Request, res: Response) {
    const { title, content } = req.body;
    try {
        // check if author exists
        const author = await getUserById(req.user_id!);
        if (!author) {
            return res.status(404).json({ message: "Author not found" });
        }
        const blog = await createBlog({ title, content, author_id: req.user_id! });
        if (!blog) {
            return res.status(500).json({ message: "Server Error" });
        }
        await redis.del(`blogs:${req.user_id}`);
        res.status(201).json(blog);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
}
/**
@swagger
/blogs/{id}:
put:
summary: Update an existing blog post
tags: [Blogs]
parameters:
  - in: path
    name: id
    required: true
    schema:
      type: string
    description: The blog ID
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        required:
          - title
          - content
          - author_id
        properties:
          title:
            type: string
            example: Updated Title
          content:
            type: string
            example: Updated content
          author_id:
            type: string
            example: 550e8400-e29b-41d4-a716-446655440000
responses:
  200:
    description: Blog updated successfully
  404:
    description: Blog not found
  401:
    description: Unauthorized
  500:
    description: Server error
*/
export async function UpdateBlog(req: Request, res: Response) {
    const { id } = req.params;
    let { title, content } = req.body;
    try {
        // check if blog exists
        const existingBlog = await getBlogById(parseInt(id as string));
        if (!existingBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        // check the owner 
        if (existingBlog.author_id !== req.user_id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const blog = await updateBlog({ id: parseInt(id as string), title, content, author_id: req.user_id });
        if (!blog) {
            return res.status(500).json({ message: "Server Error" });
        }
        await redis.del(`blogs:${req.user_id}`);
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
}
/**
@swagger
/blogs/{id}:
delete:
summary: Delete a blog post by ID
tags: [Blogs]
parameters:
  - in: path
    name: id
    required: true
    schema:
      type: string
    description: The blog ID
responses:
  200:
    description: Blog deleted successfully
    content:
      application/json:
        schema:
          type: object
          properties:
            message:
              type: string
              example: Blog deleted successfully
  404:
    description: Blog not found
  401:
    description: Unauthorized
  500:
    description: Server error
*/
export async function DeleteBlog(req: Request, res: Response) {
    const { id } = req.params;
    try {
        const blog = await getBlogById(parseInt(id as string));
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        if (blog.author_id !== req.user_id) {
            console.log("user_id ", req.user_id, blog.author_id);
            return res.status(401).json({ message: "Unauthorized" });
        }
        const isDeleted = await deleteBlog(parseInt(id as string));
        if (!isDeleted) {
            return res.status(500).json({ message: "Server Error" });
        }
        await redis.del(`blogs:${req.user_id}`);
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
}