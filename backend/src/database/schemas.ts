import { db } from ".";

export default async function createTables() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,

      author_id INTEGER NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_author
        FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    );
  `);
}