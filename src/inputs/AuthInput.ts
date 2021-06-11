import { Length, IsEmail } from "class-validator";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExist } from "../utils/isEmailAlreadyExist";

@InputType()
export class RegisterInput {
  @Field()
  @Length(1, 255)
  username: string;

  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: "email already in use" })
  email: string;

  @Field()
  password: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  
  email: string;

  @Field()
  password: string;
}
