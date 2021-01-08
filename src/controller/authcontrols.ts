import { Request, Response } from "express";
import { SESSION_NAME } from "../config/session_config";
import { User } from "../models/User";
/// <reference path="types/Request.d.ts" />
export class Session_auth {
  async signup_post(req: Request, res: Response) {
    const { username, email, password } = req.query;
    await User.create({ username, email, password });
    req.session!.userId = (await User.findOne({ username }))._id;
    req.session!.createAt = new Date();
  }
}
