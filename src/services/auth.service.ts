import { IUser } from "../interfaces/user.nterface";
import { userRepository } from "../repositories/user.repository";

class AuthService {
    public async signUp(body: Partial<IUser>): Promise<IUser> {
        return await userRepository.create(body);
    }
}

export const authService = new AuthService();