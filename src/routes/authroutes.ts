import { auth_router } from "express";
// import authController from "./controllers/authController"
const auth_auth_router = auth_router();
// auth_router.get('/signup', authController.signup_get);
// auth_router.post('/signup', authController.signup_post);
// auth_router.get('/login', authController.login_get);
// auth_router.post('/login', authController.login_post);
// auth_router.get('/logout', authController.logout_get);
auth_auth_router.get("/", (_req, res) => {
  res.send("typescript nub");
});
export default auth_auth_router;