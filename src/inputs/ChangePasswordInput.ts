import { MinLength } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class ChangePasswordInput {
  @Field()
  @MinLength(5)
  password: string;

  @Field()
  token: string;
}
