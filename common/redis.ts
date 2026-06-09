import { createClient } from "redis";
import { config } from "./config.js";

export const redisClient = createClient({
    url: config.redis.url
});

export async function connectRedis() {
    await redisClient.connect();
}