import { Router, Request, Response } from "express";

import { Session_Auth } from "../controllers/authcontrols";
const auth_routes = Router();
let authController = new Session_Auth();
auth_routes.get("/", (req: Request, res: Response) => {
  res.json("typescript nub");
});

// auth_routes.get('/signup', authController.signup_get);
auth_routes.post("/signup", authController.signup_post);
// auth_routes.get('/login', authController.login_get);
auth_routes.post('/login', authController.login_post);
// auth_routes.get('/logout', authController.logout_get);

export default auth_routes;
