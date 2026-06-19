import { Pool } from "pg";
import config from "../config/config";

export const db = new Pool({
    connectionString: config.database_url
});