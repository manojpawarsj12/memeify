import * as jwt from "jsonwebtoken";
import { getRepository} from "typeorm";
import { User } from "../entities/User";
import { Request, Response } from "express";

//const jwt_key = process.env["jwt_key"]


export class authController {
  user_obj:User;
  maxAge:number

  constructor() {
    this.user_obj = new User();
    this.maxAge =  3 * 24 * 60 * 60;
  }

  createToken = (id) => {
    return jwt.sign({ id }, "manojpawarsj", {
      expiresIn: this.maxAge,
    });
  };
  login_get(_req: Request, res: Response) {
    res.json("login get req sir");
  }
  signup_get(_req: Request, res: Response) {
    res.json("signup get req sir");
  }

  async signup_post(req: Request, res: Response) {
    try {
      console.log(req.query)
      let { username, email, password, age } = req.query;
      username = username as  string;
      console.log( username, email, password, age)
      const user_repo = getRepository(User);
      const user = user_repo.create({
        username,
        email,
        password,
        age,
        ...req.body
      });
      await user_repo.save(user).then(() => {
        res.json("record saved");
      });
    } catch (err) {
      console.log(err);
    }
  }

  async login_post(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user_repo = getRepository(User);
      const result = await user_repo.findOneOrFail({ username: username });
      if (result) {
        const chk_password: Promise<boolean> = this.user_obj.comparePassword(
          password
        );
        if (chk_password) {
          const token = this.createToken(result.user_id);
          res.cookie("jwt", token, { maxAge: this.maxAge * 1000 });
          res.status(200).json({ user: result.user_id });
        } else {
          throw Error("Invalid password");
        }
      } else {
        throw Error("Invalid Username");
      }
    } catch (err) {
      console.log(err);
    }
  }
  logout_get(_req: Request, res: Response) {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
  }
}
