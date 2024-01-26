import { NextFunction, Request, Response } from "express";

import { userRepository } from "../repositories/user.repository";
import {IUser} from "../interfaces/user.nterface";


class UserMiddleware {
    public isUserExist(field: keyof IUser) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user = await userRepository.getOneByParams({
                    [field]: req.body[field],
                });

                if (!user) {
                    // throw new ApiError("User not found", 404);
                }

                req.res.locals = user;

                next();
            } catch (e) {
                next(e);
            }
        };
    }
}

export const userMiddleware = new UserMiddleware();