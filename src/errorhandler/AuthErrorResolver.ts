import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class ErrorHandler {
  @Field(() => String)
  code!: string;

  @Field(() => String)
  message!: string;
}
