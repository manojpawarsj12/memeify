import express from "express";
import { createConnection } from "typeorm";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import auth_router from "./routes/authroutes"
const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(auth_router);
createConnection().then(() => {
  app.listen(3000, () => console.log("Server is running on localhost:3000"));
});
