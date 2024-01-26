import * as jwt from "jsonwebtoken";

import { configs } from "../configs/config";
import { ApiError } from "../errors/api.error";
import {EActionTokenType} from "../enums/token-type.enum";

export interface ITokenPayload {
    userId: string;
}

export interface ITokensPair {
    accessToken: string;
    accessExpiresIn: string;
    refreshToken: string;
    refreshExpiresIn: string;
}

class TokenService {
    public generateTokenPair(payload: ITokenPayload): ITokensPair {
        const accessToken = jwt.sign(payload, configs.JWT_ACCESS_SECRET, {
            expiresIn: configs.JWT_ACCESS_EXPIRES_IN,
        });
        const refreshToken = jwt.sign(payload, configs.JWT_REFRESH_SECRET, {
            expiresIn: configs.JWT_REFRESH_EXPIRES_IN,
        });

        return {
            accessToken,
            accessExpiresIn: configs.JWT_ACCESS_EXPIRES_IN,
            refreshToken,
            refreshExpiresIn: configs.JWT_REFRESH_EXPIRES_IN,
        };
    }

    public checkToken(token: string, type: "refresh" | "access"): ITokenPayload {
        try {
            let secret: string;

            switch (type) {
                case "access":
                    secret = configs.JWT_ACCESS_SECRET;
                    break;
                case "refresh":
                    secret = configs.JWT_REFRESH_SECRET;
                    break;
            }
            return jwt.verify(token, secret) as ITokenPayload;
        } catch (e) {
            throw new ApiError("Token not valid", 401);
        }
    }

    public checkActionToken(actionToken: string, type: EActionTokenType) {
        try {
            let secret: string;

            switch (type) {
                case EActionTokenType.FORGOT:
                    secret = configs.JWT_FORGOT_ACTION_SECRET;
                    break;
                case EActionTokenType.ACTIVATE:
                    secret = configs.JWT_ACTION_ACTIVATE_SECRET;
                    break;
                default:
                    throw new ApiError("checkActionToken error", 500);
            }

            return jwt.verify(actionToken, secret) as ITokenPayload;
        } catch (e) {
            throw new ApiError("Token not valid", 401);
        }
    }

    public createActionToken(
        payload: ITokenPayload,
        tokenType: EActionTokenType,
    ) {
        let secret: string;

        switch (tokenType) {
            case EActionTokenType.FORGOT:
                secret = configs.JWT_FORGOT_ACTION_SECRET;
                break;
            case EActionTokenType.ACTIVATE:
                secret = configs.JWT_ACTION_ACTIVATE_SECRET;
                break;
            default:
                throw new ApiError("createActionToken error", 500);
        }

        return jwt.sign(payload, secret, {
            expiresIn: configs.JWT_ACTION_EXPIRES_IN,
        });
    }



}

export const tokenService = new TokenService();