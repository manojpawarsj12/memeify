import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
//import path from "path";
import { MONGOURI, PORT, MONGO_OPTIONS } from "./config/db";
import { SESSION_OPTIONS } from "./config/session_config";
import auth_routes from "./routes/auth_routes";
import morgan from "morgan";
import session, { Store } from "express-session";
var store: Store;
const memeify = async () => {
  const app = express();
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(session({ ...SESSION_OPTIONS, store }));

  app.use(cookieParser());
  app.use(helmet());
  app.use(session(SESSION_OPTIONS));
  app.use(compression());
  app.use(auth_routes);

  mongoose.connect(MONGOURI, MONGO_OPTIONS).then(() => {
    app.listen(PORT, () => {
      console.log("listening on port  " + PORT);
    });
  });
};

memeify().catch((err) => {
  console.log(err);
});
