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
import { IsUserExist } from "../../middlewares/IsUserExist";

@Resolver()
export class FriendResolver {
  @Mutation(() => Friends, { nullable: true })
  @UseMiddleware(isAuth)
  async SendFriendRequest(
    @Arg("username") username: string,
    @Ctx() ctx: MyContext
  ): Promise<Friends | null> {
    const toUser = await User.findOne({
      where: { username: username },
    });
    if (!toUser) {
      return null;
    }
    const fromId = parseInt(ctx.req.session.userId, 10);

    const fromUser = await User.findOne(fromId);

    const FriendRequest = await Friends.create({
      fromUserId: fromId,
      toUserId: toUser?.userId,
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
    const toUser = await User.findOne({ where: { username: username } });
    if (!toUser) {
      return false;
    }
    const fromUser = await User.findOne(parseInt(ctx.req.session.userId, 10));
    await Friends.update(
      { fromUser, toUser, status: Status.Pending },
      { status: Status.Friends }
    );

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async AcceptFriendRequestNoRelation(
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
    const toUser = await User.findOne({ where: { username: username } });
    if (!toUser) {
      return false;
    }
    const fromUser = await User.findOne(parseInt(ctx.req.session.userId, 10));
    await Friends.delete({
      fromUser,
      toUser,
      status: Status.Pending,
    });
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async RemoveFriend(
    @Arg("username") username: string,
    @Ctx() ctx: MyContext
  ): Promise<Boolean> {
    const toUser = await User.findOne({ where: { username: username } });
    if (!toUser) {
      return false;
    }
    const fromUser = await User.findOne(parseInt(ctx.req.session.userId, 10));
    await Friends.delete({
      fromUser,
      toUser,
      status: Status.Friends,
    });
    return true;
  }

  @Query(() => [Friends], { nullable: true })
  @UseMiddleware(isAuth)
  @UseMiddleware(IsUserExist)
  async GetAllFriendRequest(
    //@Arg("username") username: string,
    @Ctx() ctx: MyContext
  ): Promise<Friends[] | null> {
    const userId = parseInt(ctx.req.session.userId, 10);
    const FriendList = await Friends.find({
      where: {
        status: Status.Pending,
        toUserId: userId,
      },
      relations: ["fromUser"],
    });
    if (!FriendList) {
      return null;
    }
    return FriendList;
  }
  @Query(() => [Friends], { nullable: true })
  @UseMiddleware(isAuth)
  @UseMiddleware(IsUserExist)
  async GetAllFriends(
    //@Arg("username") username: string,
    @Ctx() ctx: MyContext
  ): Promise<Friends[] | null> {
    const userId = parseInt(ctx.req.session.userId, 10);
    const CheckFriendId = await User.findOne(userId);

    const FriendList = await Friends.find({
      where: [
        {
          status: Status.Friends,
          toUser: CheckFriendId,
        },
        {
          status: Status.Friends,
          fromUser: CheckFriendId,
        },
      ],
    });
    console.log(FriendList);
    if (!FriendList) {
      return null;
    }
    return FriendList;
  }
}
