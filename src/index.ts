import express from "express";
import "reflect-metadata";
import {createConnection} from "typeorm";

//import {User} from "./entities/User"
let app = express();
//let user = new User();



app.get("/", (_req, res) => {
  res.send("typescript nub");
});


createConnection().then(() => {
  app.listen(3000,() => console.log("Server is running on localhost:3000"));
});
