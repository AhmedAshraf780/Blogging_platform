import { createClient } from "redis";
import config from "./config";

export const redis = createClient({
  url: config.redis_url,
});

redis.on("error", (err) => {
  console.error("Redis Error:", err);
});