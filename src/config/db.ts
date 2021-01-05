
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
