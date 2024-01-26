import { Types } from "mongoose";
import { ApiError } from "../errors/api.error";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { ITokenPayload, ITokensPair, tokenService } from "./token.service";
import {ILogin} from "../interfaces/auth.interface";
import {IUser} from "../interfaces/user.nterface";
import {EEmailAction} from "../enums/email-action.enum";
import {emailService} from "./email.service";
import {EActionTokenType} from "../enums/token-type.enum";

class AuthService {
    public async signUp(dto: Partial<IUser>): Promise<IUser> {
        const userFromDb = await userRepository.getOneByParams({
            email: dto.email,
        });
        if (userFromDb) {
            throw new ApiError("User with provided email already exists", 400);
        }

        const hashedPassword = await passwordService.hash(dto.password);
        const user = await userRepository.create({
            ...dto,
            password: hashedPassword,
        });

        const actionToken = tokenService.createActionToken(
            { userId: user._id},
            EActionTokenType.ACTIVATE,
        );

        await Promise.all([
            tokenRepository.createActionToken({
                actionToken,
                _userId: user._id,
                tokenType: EActionTokenType.FORGOT,
            }),
            emailService.sendMail(dto.email, EEmailAction.WELCOME, {
                name: dto.name,
                actionToken,
            }),
        ]);

        return user;
    }

    public async signIn(dto: ILogin): Promise<ITokensPair> {
        const user = await userRepository.getOneByParams({ email: dto.email });
        if (!user) {
            throw new ApiError("Not valid email or password", 401);

        }

        const isMatch = await passwordService.compare(dto.password, user.password);
        if (!isMatch) {
            throw new ApiError("Not valid email or password", 401);
        }


        if (!user.Verified) {
            throw new ApiError("Verify your account", 403);

        }
        const jwtTokens = tokenService.generateTokenPair(
            { userId: user._id}

        );
        await tokenRepository.create({ ...jwtTokens, _userId: user._id });

        return jwtTokens;
    }

    public async refresh(
        jwtPayload: ITokenPayload,
        refreshToken: string,
    ): Promise<ITokensPair> {
        await tokenRepository.deleteOneByParams({ refreshToken });

        const jwtTokens = tokenService.generateTokenPair({
            userId: jwtPayload.userId,
        });
        await tokenRepository.create({
            ...jwtTokens,
            _userId: new Types.ObjectId(jwtPayload.userId),
        });

        return jwtTokens;
    }

    public async forgotPassword(user: IUser) {
        const actionToken = tokenService.createActionToken(
            { userId: user._id },
            EActionTokenType.FORGOT,
        );

        await Promise.all([
            tokenRepository.createActionToken({
                actionToken,
                _userId: user._id,
                tokenType: EActionTokenType.FORGOT,
            }),
            emailService.sendMail(user.email, EEmailAction.FORGOT_PASSWORD, {
                actionToken,
            }),
        ]);
    }

    public async setForgotPassword(password: string, actionToken: string) {
        const payload = tokenService.checkActionToken(
            actionToken,
            EActionTokenType.FORGOT,
        );
        const entity = await tokenRepository.getActionTokenByParams({
            actionToken,
        });
        if (!entity) {
            throw new ApiError("Not valid token", 400);
        }
        const newHashedPassword = await passwordService.hash(password);
        await Promise.all([
            userRepository.updateById(payload.userId, {
                password: newHashedPassword,
            }),
            tokenRepository.deleteActionTokenByParams({ actionToken }),
        ]);
    }


    public async verify(actionToken: string) {
        const payload = tokenService.checkActionToken(
            actionToken,
            EActionTokenType.ACTIVATE,
        );
        const entity = await tokenRepository.getActionTokenByParams({
            actionToken,
        });
        if (!entity) {
            throw new ApiError("Not valid token", 400);
        }

        await Promise.all([
            userRepository.updateById(payload.userId, {
                Verified: true,
            }),
            tokenRepository.deleteActionTokenByParams({ actionToken }),
        ]);
    }

}

export const authService = new AuthService();