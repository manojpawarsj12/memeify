import argon2 from "argon2";
import { User } from "../../entities/User";
import { RegisterInput } from "../../inputs/RegisterInput";
import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { sendEmail } from "../../utils/SendEmail";
import { createConfirmationUrl } from "../../utils/CreateConfirmationEmailIUrl";
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
    try {
      const hashedPassword = await argon2.hash(password);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      }).save();
      await sendEmail(email, await createConfirmationUrl(user.id));
      return user;
    } catch (err) {
      console.log(err.message);
      throw Error(err.message);
    }
  }
}
