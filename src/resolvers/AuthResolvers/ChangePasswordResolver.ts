import { User } from "../../entities/User";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { ChangePasswordInput } from "../../inputs/ChangePasswordInput";
import { MyContext } from "../../types/MyContext";
import { redis } from "../../types/redis";
import argon2 from "argon2";
import { UserResponse } from "../../errorhandler/AuthErrorResolver";
Resolver();
export class ChangePassword {
  @Mutation(() => UserResponse)
  async ChangePassword(
    @Arg("data")
    { password, token }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    const userId = await redis.get(token);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const user = await User.findOne(userId);
    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "User doesn't exists",
          },
        ],
      };
    }
    await redis.del(token);

    user.password = await argon2.hash(password);

    await user.save();

    ctx.req.session.userId = user.userId;

    return { user };
  }
}
