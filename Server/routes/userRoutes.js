import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getProfile } from "../Controllers/userController.js";
const userRouter = express.Router();

userRouter.get("/data", userAuth, getProfile);

export default userRouter;
