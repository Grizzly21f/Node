
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { ILogin } from "../interfaces/auth.interface";
import { IUser } from "../interfaces/user.nterface";
import { passwordService } from "./password.service";
import { ITokensPair, tokenService } from "./token.service";

class AuthService {
    public async signUp(dto: Partial<IUser>): Promise<IUser> {
        const hashedPassword = await passwordService.hash(dto.password);
        return await userRepository.create({ ...dto, password: hashedPassword });
    }

    public async signIn(dto: ILogin): Promise<ITokensPair> {
        const user = await userRepository.getOneByParams({ email: dto.email });
        if (!user) throw new Error("Not valid email or password");

        const isMatch = await passwordService.compare(dto.password, user.password);
        console.log('test')
        if (!isMatch) throw new Error("Not valid email or password");

        const jwtTokens = tokenService.generateTokenPair({ userId: user._id });
        await tokenRepository.create({ ...jwtTokens, _userId: user._id });

        return jwtTokens;
    }
}

export const authService = new AuthService();