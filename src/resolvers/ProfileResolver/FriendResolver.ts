import { Friends, Status } from "../../entities/Friends";
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
import { User } from "../../entities/User";

@Resolver()
export class FriendResolver {
  @Mutation(() => Friends)
  @UseMiddleware(isAuth)
  async SendFriendRequest(
    @Arg("username") username: string,
    @Ctx() ctx: MyContext
  ): Promise<Friends | null> {
    const toUserId = await User.findOne({
      select: ["userId"],
      where: { username: username },
    });
    console.log(toUserId?.userId);
    if (!toUserId) {
      return null;
    }
    const fromId = parseInt(ctx.req.session.userId, 10);

    const fromUser = await User.findOne(fromId);
    const toUser = await User.findOne(toUserId?.userId);

    const FriendRequest = await Friends.create({
      fromUserId: fromId,
      toUserId: toUserId?.userId,
      fromUser,
      toUser,
    }).save();
    return FriendRequest;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async AcceptFriendRequest(
    @Arg("username") username: string,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    const toUserId = await User.findOne({ where: { username: username } });
    if (!toUserId) {
      return false;
    }
    const fromUserId = parseInt(ctx.req.session.userId, 10);
    await Friends.update(
      { fromUserId, toUserId: toUserId?.userId, status: Status.Pending },
      { status: Status.Friends }
    );
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async RejectFriendRequest(
    @Arg("username") username: string,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    const toUserId = await User.findOne({ where: { username: username } });
    if (!toUserId) {
      return false;
    }
    const fromUserId = parseInt(ctx.req.session.userId, 10);
    await Friends.delete({
      fromUserId,
      toUserId: toUserId?.userId,
      status: Status.Pending,
    });
    return true;
  }

  @Query(() => [Friends])
  @UseMiddleware(isAuth)
  async GetAllFriendRequest(
    //@Arg("username") username: string,
    @Ctx() ctx: MyContext
  ): Promise<Friends[] | null> {
    const userId = parseInt(ctx.req.session.userId, 10);
    const user = await User.findOne(userId);
    if (!user) {
      return null;
    }
    const FriendList = await Friends.find({
      where: {
        status: Status.Pending,
        toUserId: userId,
      },
    });
    if (!FriendList) {
      return null;
    }
    return FriendList;
  }
}
