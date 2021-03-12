import argon2 from "argon2";
import { User } from "../entities/User";
import { RegisterInput } from "../inputs/RegisterInput";
import { Resolver, Query, Mutation, Arg } from "type-graphql";

@Resolver()
export class RegisterUser {
  @Query(() => String)
  async hello() {
    return "Hello World!";
  }
  @Mutation(() => User)
  async register(
    @Arg("data")
    { username, email, password }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await argon2.hash(password);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    }).save();

    return user;
  }
}
