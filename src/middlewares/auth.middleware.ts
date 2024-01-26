import { NextFunction, Request, Response } from "express";


import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
    public async checkAccessToken(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const tokenString = req.get("Authorization");
            if (!tokenString) {

            }

            const accessToken = tokenString.split("Bearer ")[1];
            const jwtPayload = tokenService.checkToken(accessToken, "access");

            const entity = await tokenRepository.getOneBy({ accessToken });
            if (!entity) {

            }

            req.res.locals.jwtPayload = jwtPayload;
            next();
        } catch (e) {
            next(e);
        }
    }

    public async checkRefreshToken(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const tokenString = req.get("Authorization");
            if (!tokenString) {

            }

            const refreshToken = tokenString.split("Bearer ")[1];
            const jwtPayload = tokenService.checkToken(refreshToken, "refresh");

            const entity = await tokenRepository.getOneBy({ refreshToken });
            if (!entity) {

            }

            req.res.locals.jwtPayload = jwtPayload;
            req.res.locals.refreshToken = refreshToken;
            next();
        } catch (e) {
            next(e);
        }
    }
}

export const authMiddleware = new AuthMiddleware();