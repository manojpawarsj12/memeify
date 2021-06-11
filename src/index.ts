<<<<<<< HEAD
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";

import cookieParser from "cookie-parser";
import compression from "compression";
import { REDIS_OPTIONS, typeorm_connection } from "./config/db_config";
import { SESSION_OPTIONS } from "./config/session_config";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import cors from "cors";

const main = async () => {
  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis(REDIS_OPTIONS);
  const store = new RedisStore({
    client: redis,
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(session({ ...SESSION_OPTIONS, store }));

  app.use(cookieParser());

  app.use(compression());
  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:4000",
    })
  );

  const schema = await buildSchema({
    resolvers: [__dirname + "/resolvers/**/*.ts"],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
    tracing: true,
  });
  apolloServer.applyMiddleware({ app });
  createConnection(typeorm_connection)
    .then(() => {
      console.log("database connected");
      // here you can start to work with your entities
      redis.connect(() => {
        console.log("reddis connected");
        app.listen(4000, () => {
          console.log("4000");
        });
      });
    })
    .catch((error) => console.log(error));
};

main().catch((err) => {
  console.log(err);
});

