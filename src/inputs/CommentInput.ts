import { Field, InputType } from "type-graphql";

@InputType()
export class CreateCommentInput {
  @Field()
  postId: number;

  @Field()
  comment_text: string;
}

@InputType()
export class UpdateCommentInput {
  @Field()
  commentId: number;

  @Field()
  comment_text: string;
}

@InputType()
export class ReplyCommentInput {
  @Field()
  postId: number;

  @Field()
  commentId: number;

  @Field()
  comment_text: string;
}
