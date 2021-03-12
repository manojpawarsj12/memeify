import { Resolver, Mutation, Arg, Ctx } from "type-graphql";

import { User } from "../entities/User";
import { MyContext } from "../types/MyContext";
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
      return null;
    }
    const valid = await argon2.verify(user.password,password);
    
    if (!valid) {
      return null;
    }

    ctx.req.session!.userId = user.id;

    return user;
  }
}