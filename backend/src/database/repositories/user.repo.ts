import { db } from "..";
import { User } from "../../models/user.model";

export async function getUserByEmail(email: string): Promise<User | null> {
    const query = `
        SELECT * FROM users
        WHERE email = $1
    `;

    try {
        const res = await db.query(query, [email]);
        return res.rows[0] || null;
    } catch (err) {
        console.log(err);
        throw new Error("Couldn't get user by email");
    }
}
export async function getUserById(id: number): Promise<User | null> {
    const query = `
        SELECT * FROM users
        WHERE id = $1
    `;
    try {
        const res = await db.query(query, [id]);
        return res.rows[0] || null;
    } catch (err) {
        console.log(err);
        throw new Error("Couldn't get user by id");
    }
}


export async function insertUser(user: User): Promise<User> {
    const query = `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING *
    `;

    try {
        const res = await db.query(query, [user.name, user.email, user.password]);
        return res.rows[0];
    } catch (err) {
        console.log(err);
        throw new Error("Couldn't insert user");
    }
}

