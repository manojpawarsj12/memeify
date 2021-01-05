import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import compression from "compression";
//import path from "path";
import { MONGOURI, PORT, MONGO_OPTIONS } from "./config/db";

import morgan from "morgan";
const app = express();
dotenv.config({ path: "../.env" });
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());

mongoose
  .connect(MONGOURI, MONGO_OPTIONS)
  .then(() => app.listen(PORT))
  .catch((err) => console.log(err));
