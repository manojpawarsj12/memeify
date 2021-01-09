import { Request, Response } from "express";
import { SESSION_NAME } from "../config/session_config";
import { User } from "../models/User";

declare module "express-session" {
  export interface SessionData {
    userId: string;
    createAt: number;
  }
}
declare namespace Express {
  export interface Request {
    username: string;
    email: string;
    password: string;
  }
}
export class Session_Auth {
  async signup_post(req: Request, res: Response) {
    const { username, email, password } = req.query;
    const user = await User.create({
      username: username,
      email: email,
      password: password,
    });
    req.session.userId = user.id;
    req.session.createAt = Date.now();
    console.log(req.session)
    res.json({
      message: "signup done",
      user: user,
    });
  }
  async login_post(req: Request, res: Response) {
    const { username, password } = req.query;
    const user = await User.findOne({ username: username, ...req.body });
    if (!user || !(await user.matchesPassword(password))) {
      throw Error("Incorrect email or password");
    }
    req.session.userId = user.id;
    req.session.createAt = Date.now();
    res.json({
      message: "login done",
      user: user,
    });
  }
  async logOut(req: Request, res: Response) {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      }
    });
    res.clearCookie(SESSION_NAME);
    res.json({
      message: "logout done",
      user: req.session,
    });
  }
}
