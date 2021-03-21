import { Resolver, Mutation, Arg, Ctx } from "type-graphql";

import { User } from "../../entities/User";
import { MyContext } from "../../types/MyContext";
import argon2 from "argon2";

@Resolver()
export class LoginUser {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("user doesnot exist");
    }
    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      throw new Error("incorrect username or password");
    }
    if (!user.confirmed) {
      throw new Error("user hasn't confirmed");
    }
    ctx.req.session.userId = user.userId;
    return user;
  }
}
