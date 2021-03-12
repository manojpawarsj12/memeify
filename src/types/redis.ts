import { REDIS_OPTIONS } from "../config/db_config";
import Redis from "ioredis";

export const redis = new Redis(REDIS_OPTIONS);
