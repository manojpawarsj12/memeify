import { Field, InputType } from "type-graphql";

@InputType()
export class CreatePostInput {
  @Field()
  post_text!: string;
}
