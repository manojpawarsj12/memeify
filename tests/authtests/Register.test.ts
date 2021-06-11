import faker from "faker";
import { Connection } from "typeorm";
import { testConn } from "../utils/testConn";
import { gCall } from "./../utils/gCall";
import {User} from "../../src/entities/User"

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});
afterAll(async () => {
  await conn.close();
});

const registerMutation = `mutation ($data: RegisterInput!){
  register(
    data: $data
  )
  {

    username
    email
  }
}
`
describe("Register", () => {
  it.only("create user", async () => {
    const user = {
      
      username : faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
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
    expect(dbUser!.confirmed).toBeFalsy();
    expect(dbUser!.username).toBe(user.username);
  });
});
