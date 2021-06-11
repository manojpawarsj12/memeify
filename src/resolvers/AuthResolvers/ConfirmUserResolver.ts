import { UserResponse } from "../../errorhandler/AuthErrorResolver";
import { Resolver, Mutation, Arg } from "type-graphql";

import { User } from "../../entities/User";
import { redis } from "../../types/redis";
@Resolver()
export class ConfirmUser {
  @Mutation(() => UserResponse)
  async confirmUser(@Arg("token") token: string): Promise<UserResponse> {
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

    await User.update({ userId: parseInt(userId, 10) }, { confirmed: true });
    await redis.del(token);

    return { done: true };
  }
}
