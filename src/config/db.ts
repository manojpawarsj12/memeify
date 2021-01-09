import { RedisOptions } from 'ioredis'
import { ConnectionOptions } from 'mongoose'

export const MONGO_OPTIONS: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}
export const {
  MONGOURI = "mongodb://127.0.0.1:27017/memeify",
  PORT = 3000,
} = process.env;



const {
  REDIS_PORT = 6379,
  REDIS_HOST = 'localhost',
  REDIS_PASSWORD = 'secret'
} = process.env

export const REDIS_OPTIONS: RedisOptions = {
  port: +REDIS_PORT,
  host: REDIS_HOST,
  password: REDIS_PASSWORD
}