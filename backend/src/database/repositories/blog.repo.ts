import { db } from "..";
import { Blog } from "../../models/blog.model";

export async function getBlogs(): Promise<Blog[]> {
    const query = `
        SELECT blogs.*, users.name as author_name FROM blogs
        LEFT JOIN users ON users.id = blogs.author_id
    `;
    try {
        const res = await db.query(query);
        return res.rows;
    } catch (err) {
        console.log(err);
        throw new Error("Couldn't get all blogs");
    }
}
export async function getBlogsOfUser(user_id: number): Promise<Blog[]> {
    const query = `
    select blogs.*, users.name as author_name FROM blogs
    LEFT JOIN users ON users.id = blogs.author_id
    WHERE blogs.author_id = $1
    `;
    try {
        const res = await db.query(query, [user_id]);
        return res.rows;
    } catch (err) {
        console.log(err);
        throw new Error("Couldn't get all blogs");
    }
}


export async function getBlogById(id: number): Promise<Blog | null> {
    const query = `
        SELECT * FROM blogs
        WHERE id = $1
    `;
    try {
        const res = await db.query(query, [id]);
        return res.rows[0];
    } catch (err) {
        console.log(err);
        throw new Error("Couldn't get blog by id");
    }
}

export async function createBlog(blog: Blog): Promise<any> {
    const query = `
        INSERT INTO blogs (title, content, author_id)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    try {
        const res = await db.query(query, [blog.title, blog.content, blog.author_id]);
        return res.rows[0];
    } catch (err) {
        console.log(err);
        throw new Error("Couldn't create blog");
    }
}

export async function updateBlog(blog: Blog): Promise<any> {
    const query = `
        UPDATE blogs
        SET title = $1, content = $2, author_id = $3
        WHERE id = $4
        RETURNING *
    `;
    try {
        const res = await db.query(query, [blog.title, blog.content, blog.author_id, blog.id]);
        return res.rows[0];
    } catch (err) {
        console.log(err);
        throw new Error("Couldn't update blog");
    }
}

export async function deleteBlog(id: number): Promise<boolean> {
    const query = `
        DELETE FROM blogs
        WHERE id = $1
        RETURNING *
    `;
    try {
        const res = await db.query(query, [id]);
        return res.rows[0] ? true : false;
    } catch (err) {
        console.log(err);
        throw new Error("Couldn't delete blog");
    }
}