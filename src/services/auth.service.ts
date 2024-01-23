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

class AuthService {
    public async signUp(dto: Partial<IUser>): Promise<IUser> {
        const userFromDb = await userRepository.getOneByParams({
            email: dto.email,
        });
        if (userFromDb) {
            throw new ApiError("User with provided email already exists", 400);
        }

        const hashedPassword = await passwordService.hash(dto.password);

        const users = await userRepository.getAll();

        await Promise.all(
          users.map(async (user) => {
            await emailService.sendMail(user.email, EEmailAction.WELCOME, {
              name: user.name,
            });
          }),
        );

        await emailService.sendMail(dto.email, EEmailAction.WELCOME, {
            name: dto.name,
        });

        return await userRepository.create({ ...dto, password: hashedPassword });
    }

    public async signIn(dto: ILogin): Promise<ITokensPair> {
        const user = await userRepository.getOneByParams({ email: dto.email });
        if (!user) throw new ApiError("Not valid email or password", 401);

        const isMatch = await passwordService.compare(dto.password, user.password);
        if (!isMatch) throw new ApiError("Not valid email or password", 401);

        const jwtTokens = tokenService.generateTokenPair({ userId: user._id });
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
}

export const authService = new AuthService();