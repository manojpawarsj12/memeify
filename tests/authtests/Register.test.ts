import faker from "faker";
import { Connection } from "typeorm";
import { testConn } from "../utils/testConn";
import { gCall } from "./../utils/gCall";
import { User } from "../../src/entities/User";

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});
afterAll(async () => {
  await conn.close();
});

const username = faker.internet.userName();
const email = faker.internet.email();
const password = faker.internet.password();

const registerMutation = `
mutation Register($data: RegisterInput!) {
  register(
    data: $data
  ) {
    username
    email
    
  }
}
`;
const LoginMutation = `
mutation Register($data: LoginInput!){
  login(data: $data) {
    user {
      email
    }
    errors{
      message
    }
  }
}
`;
jest.setTimeout(100000);
describe("Register", () => {
  it.only("create user", async () => {
    const user = {
      username,
      email,
      password,
    };

    const response = await gCall({
      source: registerMutation,
      variableValues: {
        data: user,
      },
    });

    if (response.errors) {
      console.log(response.errors[0].originalError);
    }

    expect(response).toMatchObject({
      data: {
        register: {
          username: user.username,
          email: user.email,
        },
      },
    });

    const dbUser = await User.findOne({ where: { email: user.email } });
    expect(dbUser).toBeDefined();

    expect(dbUser!.username).toBe(user.username);
  });
});

describe("Login", () => {
  it.only("login user", async () => {
    const user = {
      email,
      password,
    };

    const response = await gCall({
      source: LoginMutation,
      variableValues: {
        data: user,
      },
    });

    if (response.errors) {
      console.log(response.errors[0].originalError);
    }

    expect(response).toMatchObject({
      data: {
        login: {
          errors: null,
          user: {
            email: user.email,
          },
        },
      },
    });

    const dbUser = await User.findOne({ where: { email: user.email } });
    expect(dbUser).toBeDefined();

    expect(dbUser!.email).toBe(user.email);
  });
});
