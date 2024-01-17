import {Router} from "express";

import {userControler} from "../controllers/user.controller";
import userMiddleware from "../middlewares/common.middleware";

const router = Router ();

router.get('',userControler.getAll)

router.get('/:id',userControler.getAllById);

router.put('/:id',userMiddleware.validateUserName,userMiddleware.validateUserNotExist, userControler.update);

router.delete('/:id', userControler.delete);
export const userRouter = router;