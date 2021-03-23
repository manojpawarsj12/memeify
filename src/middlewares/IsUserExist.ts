import { User } from "../entities/User";
import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../types/MyContext";

export const IsUserExist: MiddlewareFn<MyContext> = async (
  { context },
  next
) => {
  if (!context.req.session.userId) {
    throw new Error("not authenticated");
  }
  const user = await User.findOne(context.req.session.userId);
  if (user) {
    return next();
  } else {
    throw new Error("user doesn't exist");
  }
};
