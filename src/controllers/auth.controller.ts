import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service";
import { ILogin } from "../interfaces/auth.interface";
import { IUser } from "../interfaces/user.nterface";

class AuthController {
    public async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body as Partial<IUser>;
            const createdUser = await authService.signUp(body);

            return res.json({ data: createdUser });
        } catch (e) {
            next(e);
        }
    }

    public async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const body = req.body as ILogin;
            const jwtTokens = await authService.signIn(body);

            return res.json({ data: jwtTokens });
        } catch (e) {
            next(e);
        }
    }
}

export const authController = new AuthController();