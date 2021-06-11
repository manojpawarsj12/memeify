import { buildSchema } from "type-graphql";

export const createSchema = async () => {
  return await buildSchema({
    resolvers: [__dirname + "/../src/resolvers/**/*.ts"],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });
};
