import { Router } from "express";
import { authController } from "../controllers/authController";
const auth_router = Router();
const authcontrols = new authController();
auth_router.get("/signup", authcontrols.signup_get);
auth_router.post("/signup", authcontrols.signup_post);
auth_router.get("/login", authcontrols.login_get);
auth_router.post("/login", authcontrols.login_post);
auth_router.get("/logout", authcontrols.logout_get);

auth_router.get("/", (_req, res) => {
  res.send("typescript nub");
});
export default auth_router;
