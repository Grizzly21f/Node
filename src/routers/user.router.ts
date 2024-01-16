import {Router} from "express";

import {userControler} from "../controllers/user.controller";
import userMiddleware from "../middlewares/common.middleware";

const router = Router ();

router.get('',userControler.getAll)

router.get('/:id',userControler.getAllById);

router.post('/',userMiddleware.validateUserName, userControler.create);

router.put('/:id',userMiddleware.validateUserId,userMiddleware.validateUserName,userMiddleware.validateUserNotExist, userControler.update);

router.delete('/:id', userControler.delete);
export const userRouter = router;