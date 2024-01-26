import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validator";
import {userMiddleware} from "../middlewares/user.middleware";

const router = Router();

router.post("/sign-up", commonMiddleware.isBodyValid(UserValidator.create), authController.signUp,);

router.post("/sign-in", commonMiddleware.isBodyValid(UserValidator.login), authController.signIn,);

router.post("/refresh", authMiddleware.checkRefreshToken, authController.refresh,);

router.post("/forgot-password", commonMiddleware.isBodyValid(UserValidator.forgotPassword), userMiddleware.isUserExist("email"), authController.forgotPassword,);

router.put("/forgot-password/:token", commonMiddleware.isBodyValid(UserValidator.setForgotPassword), authController.setForgotPassword,);

router.put("/verify/:token", authController.verify);


//commonMiddleware.isBodyValid(UserValidator.login)
export const authRouter = router;