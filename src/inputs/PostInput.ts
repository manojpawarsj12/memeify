import { Field, InputType } from "type-graphql";

@InputType()
export class CreatePostInput {
  @Field()
  post_text: string;
}
@InputType()
export class UpdatePostInput {
  @Field()
  id!: number;
  @Field()
  post_text!: string;
}
