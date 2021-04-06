import argon2 from "argon2";
import { User } from "../../entities/User";
import { RegisterInput } from "../../inputs/RegisterInput";
import { Resolver, Mutation, Arg } from "type-graphql";
import { sendEmail } from "../../utils/SendEmail";
import { createConfirmationUrl } from "../../utils/CreateConfirmationEmailIUrl";
@Resolver()
export class RegisterUser {
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
    })
      .save()
      .catch((err) => {
        throw new Error(err.message);
      });
    await sendEmail(email, await createConfirmationUrl(user.userId));
    return user;
  }
}
