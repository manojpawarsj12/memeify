import { Router } from "express";

const auth_router = Router();

auth_router.get("/", (_req, res) => {
  res.send("typescript nub");
});
export default auth_router;