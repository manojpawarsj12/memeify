import { User } from "../../entities/User";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { ChangePasswordInput } from "../../inputs/ChangePasswordInput";
import { MyContext } from "../../types/MyContext";
import { redis } from "../../types/redis";
import argon2 from "argon2";

Resolver();
export class ChangePassword {
  @Mutation(() => User, { nullable: true })
  async ChangePassword(
    @Arg("data")
    { password, token }: ChangePasswordInput,
    @Ctx() ctx: MyContext
  ): Promise<User | null> {
    const userId = await redis.get(token);
    if (!userId) {
      return null;
    }
    const user = await User.findOne(userId);
    if (!user) {
      return null;
    }
    await redis.del(token);

    user.password = await argon2.hash(password);

    await user.save();

    ctx.req.session.userId = user.userId;

    return user;
  }
}
