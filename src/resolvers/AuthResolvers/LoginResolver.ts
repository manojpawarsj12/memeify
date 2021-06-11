import { Resolver, Mutation, Arg, Ctx } from "type-graphql";

import { User } from "../../entities/User";
import { MyContext } from "../../types/MyContext";
import argon2 from "argon2";
import { UserResponse } from "../../errorhandler/AuthErrorResolver";

@Resolver()
export class LoginUser {
  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "email doesn't exists",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "password isn't matching",
          },
        ],
      };
    }
    if (!user.confirmed) {
      return {
        errors: [
          {
            field: "confirmed",
            message: "user hasn't confirmed",
          },
        ],
      };
    }
    ctx.req.session.userId = user.userId;
    return { user };
  }
}
