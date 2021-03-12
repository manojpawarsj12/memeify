import { Request, Response } from "express";
import { Session} from "express-session";

export interface MyContext {
  req: Request & {
    session: Session &{ userId: string | any };
  };
  res: Response;
}
