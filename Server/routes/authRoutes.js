import express from "express";
const authRouter = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
  sendVerifyOTP,
  verifyUser,
  isUserAuthenticated,
  resetPassword,
  sendResetOTP,
} from "../Controllers/authController.js";
import userAuth from "../middleware/userAuth.js";


authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.post("/send-verify-otp", userAuth, sendVerifyOTP);
authRouter.post("/verify-user", userAuth, verifyUser);
authRouter.get("/is-authenticated", userAuth, isUserAuthenticated);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/send-reset-otp", sendResetOTP);
// authRouter.get('/profile', getUserProfile);
export default authRouter;
