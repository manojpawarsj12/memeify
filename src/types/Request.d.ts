export {};

declare module "express" {
  interface Request {
    username: string;
    email: string;
    password: string;
  }
}
