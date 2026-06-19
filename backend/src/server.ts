import { Application } from "express";
import config from "./config/config";
import createTables from "./database/schemas";
import { redis } from "./config/redis";

let retries = 5;
export default async function start(app: Application) {
    try {
        // connect to postgres db
        await createTables();
        console.log("Database and tables created successfully");
        // connect to redis
        await redis.connect();
        console.log("Redis connected successfully");
        app.listen(config.port, () => {
            console.log("Server is running on port " + config.port);
        });
    } catch (err) {
        console.log("Couldn't up the server ", err);
        if (retries > 0) {
            retries--;
            console.log("Retrying...");
            await new Promise(resolve =>
                setTimeout(resolve, 3000)
            );
            await start(app);
        } else {
            console.log("Server couldn't start");
            process.exit(1);
        }
    }
}