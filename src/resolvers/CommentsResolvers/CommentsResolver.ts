import { Comments } from "../../entities/Comments";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../../middlewares/IsAuth";
import { MyContext } from "../../types/MyContext";
import {
  CreateCommentInput,
  ReplyCommentInput,
  UpdateCommentInput,
} from "../../inputs/CommentInput";
import { Post } from "../../entities/Post";
import { User } from "../../entities/User";
import { getConnection } from "typeorm";
import { CommentReplies } from "../../entities/CommentReplies";

@Resolver()
export class CommentsResolver {
  @Mutation(() => Comments, { nullable: true })
  @UseMiddleware(isAuth)
  async CreateComment(
    @Arg("data")
    { postId, comment_text }: CreateCommentInput,
    @Ctx() ctx: MyContext
  ): Promise<Comments | null> {
    const post = await Post.findOne(postId);
    const user = await User.findOne(ctx.req.session.userId);
    if (post) {
      const comment = await Comments.create({
        userId: ctx.req.session.userId,
        postId: post.postId,
        comment_text: comment_text,
        user: user,
        posts: post,
      })
        .save()
        .catch((err) => {
          throw new Error(err.message);
        });
      return comment;
    }
    return null;
  }
  @Query(() => [Comments], { nullable: true })
  @UseMiddleware(isAuth)
  async GetPostComments(
    @Arg("postId") postId: number,
    @Ctx() ctx: MyContext
  ): Promise<Comments[] | null> {
    const post = await Post.findOne(postId);
    if (post) {
      const comments = await Comments.find({
        where: { postId: post.postId, userId: ctx.req.session.userId },
        order: { createdAt: "ASC" },
        relations: ["user", "ParentComment", "ChildComment"],
      });
      if (comments) {
        console.log(comments[0].ParentComment);
        return comments;
      }
      return null;
    }
    return null;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async DeleteComment(@Arg("commentId") commentId: number): Promise<Boolean> {
    const comment = await Comments.findOne(commentId);
    if (comment) {
      await Comments.delete(comment);
      return true;
    }
    return false;
  }
  @Mutation(() => Comments, { nullable: true })
  @UseMiddleware(isAuth)
  async UpdateComment(
    @Arg("data")
    { commentId, comment_text }: UpdateCommentInput,
    @Ctx() ctx: MyContext
  ): Promise<Comments | null> {
    const comment = await Comments.findOne(commentId);
    if (comment) {
      const comment = await getConnection()
        .createQueryBuilder()
        .update(Comments)
        .set({ comment_text: comment_text })
        .where('commentId = :commentId and "userId" = :userId', {
          commentId,
          userId: ctx.req.session.userId,
        })
        .returning("*")
        .execute();
      if (comment) {
        return comment.raw[0];
      }
      return null;
    }
    return null;
  }

  @Mutation(() => Comments, { nullable: true })
  @UseMiddleware(isAuth)
  async CreateReplyComment(
    @Arg("data")
    { postId, commentId, comment_text }: ReplyCommentInput,
    @Ctx() ctx: MyContext
  ): Promise<Comments | null> {
    const comment = await Comments.findOne(commentId);
    const post = await Post.findOne(postId);
    const user = await User.findOne(ctx.req.session.userId);
    if (comment && post) {
      const RepliedComment = await Comments.create({
        userId: ctx.req.session.userId,
        postId: post.postId,
        comment_text: comment_text,
        user: user,
        posts: post,
      })
        .save()
        .catch((err) => {
          throw new Error(err.message);
        });
      await CommentReplies.create({
        PC: comment,
        CC: RepliedComment,
      }).save();

      return comment;
    }
    return null;
  }
}
