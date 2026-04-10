import { createClient } from "redis"

let redis: any;

export async function getRedisClient() {
    if (!redis) {
        try {
            redis = createClient({
                url: process.env.REDIS_URL || "redis://localhost:6379", // Fixed port
            });
            redis.on("error", (err: any) => console.error("Redis Client Error", err));
            await redis.connect();
            console.log("Connected to Redis");
        } catch (error) {
            console.error("Redis connection failed:", error);
            redis = null;
        }
    }
    return redis;
}

export async function getCachedGenerationCount(userEmail: string): Promise<number | null> {
    try {
        const client = await getRedisClient();
        if (!client) return null;

        const cachedCount = await client.get(`user:${userEmail}:count`);

        if (cachedCount) {
            console.log(`Cache hit for ${userEmail}: ${cachedCount} generations`);
            return parseInt(cachedCount);
        } else {
            console.log(`Cache miss for ${userEmail}: ${cachedCount}`);
            return null; // Cache miss or expired
        }

    } catch (error) {
        console.error('Redis cache read error:', error);
        return null;
    }
}

export async function setCachedGenerationCount(userEmail: string, count: number): Promise<void> {
    try {
        const client = await getRedisClient();
        if (!client) return;

        await client.set(`user:${userEmail}:count`, count.toString(), { EX: 1800 });
        console.log(`Cached generation count for ${userEmail}: ${count}`);
    } catch (error) {
        console.error('Redis cache write error:', error);
    }
}

export async function incrementCachedGenerationCount(userEmail: string): Promise<number> {
    try {
        const client = await getRedisClient();
        if (!client) return 0;

        const newCount = await client.incr(`user:${userEmail}:count`);
        console.log(`Incremented generation count for ${userEmail}: ${newCount}`);
        return newCount;
    } catch (error) {
        console.error('Redis cache increment error:', error);
        return 0;
    }
}

export async function invalidateUserCache(userEmail: string): Promise<void> {
    try {
        const client = await getRedisClient();
        if (!client) return;

        await client.del(`user:${userEmail}:count`);
        console.log(`Cache invalidated for ${userEmail}`);
    } catch (error) {
        console.error('Redis cache invalidation error:', error);
    }
}

