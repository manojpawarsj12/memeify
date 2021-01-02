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

export async function login_post(req, res) {
  try {
    const { username, password } = req.body;
    const result = await user_repo.findOne({ username: username });
    const token = createToken(result.user_id);
    res.cookie("jwt", token, { maxAge: maxAge * 1000 });
    res.status(200).json({ user: result.user_id });
  } catch (err) {
    console.log(err);
  }
}
export function logout_get(_req, res) {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
}
