import Redis from "ioredis";

class IRedisService {
  private redisClient: Redis;

  constructor(redisInstance: typeof Redis) {
    this.redisClient = new redisInstance({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT as unknown as number,
      password: process.env.REDIS_PASSWORD,
      username: process.env.REDIS_USERNAME,
    });

    this.redisClient.on("ready", () => console.log("🔴Redis is ready ✅"));
    this.redisClient.on("error", (e) =>
      console.log("🔴Redis error:: ❌", e.message),
    );
  }

  async get(key: string) {
    const data = await this.redisClient.get(key);
    if (!data) return null;
    return data;
  }

  async set(key: string, value: any, duration: number) {
    return this.redisClient.set(key, JSON.stringify(value), "EX", duration);
  }

  async del(key: string) {
    return this.redisClient.del(key);
  }
}

const RedisService = new IRedisService(Redis);

export default RedisService;
