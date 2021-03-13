import { RedisOptions } from "ioredis";
const { REDIS_PORT = 6379, REDIS_HOST = "localhost" } = process.env;
import { ConnectionOptions } from "typeorm";
export const REDIS_OPTIONS: RedisOptions = {
  port: +REDIS_PORT,
  host: REDIS_HOST,
};

export const typeorm_connection: ConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5433,
  database: "memeify",
  username: "postgres",
  password: "xlmrsj0090",
  synchronize: true,
  logging: true,
  entities: ["src/entities/*.*"],
  migrations: ["src/migrations/*.*"],
};
