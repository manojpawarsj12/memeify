import { Post } from "../../entities/Post";
import {
  Arg,
  Resolver,
  Mutation,
  Ctx,
  Int,
  UseMiddleware,
  Query,
} from "type-graphql";
import { CreatePostInput } from "../../inputs/CreatePostInput";
import { MyContext } from "../../types/MyContext";
import { UpdatePostInput } from "../../inputs/UpdatePostInput";
import { getConnection } from "typeorm";
import { isAuth } from "../../middlewares/IsAuth";
import { User } from "../../entities/User";
@Resolver()
export class CreatePost {
  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async CreatePost(
    @Arg("data")
    { post_text }: CreatePostInput,
    @Ctx() ctx: MyContext
  ): Promise<Post | null> {
    const creatorId = parseInt(ctx.req.session.userId, 10);
    const user = await User.findOne(creatorId);
    const post = await Post.create({
      post_text,
      creator: user,
      creatorId,
    }).save();
    return post;
  }
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async DeletePost(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<boolean | null> {
    const creatorId = parseInt(ctx.req.session.userId, 10);
    await Post.delete({ id, creatorId });
    return true;
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async UpdatePost(
    @Arg("data")
    { id, post_text }: UpdatePostInput,
    @Ctx() ctx: MyContext
  ): Promise<Post | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Post)
      .set({ post_text: post_text })
      .where('id = :id and "creatorId" = :creatorId', {
        id,
        creatorId: ctx.req.session.userId,
      })
      .returning("*")
      .execute();

    return result.raw[0];
  }

  @Query(() => [Post])
  @UseMiddleware(isAuth)
  async GetCurrentUserPostNoRelation(
    @Arg("userId", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<Post[]> {
    console.log(id);
    const post = await getConnection()
      .getRepository(Post)
      .createQueryBuilder("post")
      .where('"creatorId" = :creatorId', { creatorId: ctx.req.session.userId })
      .orderBy('"createdAt"', "ASC")
      .getMany();
    return post;
  }
  @Query(() => [Post])
  @UseMiddleware(isAuth)
  async GetCurrentUserPost(
    @Arg("userId", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<Post[]> {
    console.log(id);
    const post = await Post.find({
      where: { creatorId: ctx.req.session.userId },
      relations: ["creator"],
      order: { createdAt: "ASC" },
    });
    return post;
  }
}
