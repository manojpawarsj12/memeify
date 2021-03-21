import { Resolver, Mutation, Arg } from "type-graphql";
import { v4 } from "uuid";

import { sendEmail } from "../../utils/sendEmail";
import { User } from "../../entities/User";
import { redis } from "../../types/redis";

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return false;
    }

    const token = v4();
    await redis.set(token, user.userId, "ex", 60 * 60 * 24); // 1 day expiration

    await sendEmail(
      email,
      `http://localhost:3000/user/change-password/${token}`
    );

    return true;
  }
}
