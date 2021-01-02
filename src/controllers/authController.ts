import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { User } from "../entities/User";

const user_repo = getRepository(User);
const maxAge: number = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.jwt_key, {
    expiresIn: maxAge,
  });
};
export function login_get(_req, res) {
  res.json("login get req sir");
}
export function signup_get(_req, res) {
  res.json("signup get req sir");
}

export async function signup_post(req, res) {
  try {
    const { username, email, FirstName, LastName, age, password } = req.body;
    const user = user_repo.create({
      username,
      email,
      FirstName,
      LastName,
      age,
      password,
    });
    await user.save().then(() => {
      res.json("record saved");
    });
  } catch (err) {
    console.log(err);
  }
}

export async function login_post(req,res){
    try{
        const { username, password } = req.body;
        

    }
}
