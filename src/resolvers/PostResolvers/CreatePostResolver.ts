import { Post } from "../../entities/Post";
import { Arg, Resolver, Mutation, Ctx } from "type-graphql";
import { CreatePostInput } from "../../inputs/CreatePostInput";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class CreatePost {
  @Mutation(() => Post, { nullable: true })
  async CreatePost(
    @Arg("data")
    { post_text }: CreatePostInput,
    @Ctx() ctx: MyContext
  ): Promise<Post | null> {
    const creatorId = parseInt(ctx.req.session.userId, 10);
    const post = await Post.create({ post_text, creatorId }).save();
    return post;
  }
}
