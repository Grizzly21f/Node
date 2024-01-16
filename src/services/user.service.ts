import {userRepository} from "../repositories/user.repository";
import {IUser} from "../interfaces/user.nterface";

class UserService {
    public async getAll ():Promise<IUser[]> {
        const users = await userRepository.getAll();
        return users;
    }

    public async getAllById(userId: number): Promise<IUser> {
        return userRepository.getAllById(userId);
    }

    public async create(newData: IUser): Promise<IUser> {
        return userRepository.create(newData);
    }

    public async update(userId: number, newData: IUser): Promise<IUser> {
        return userRepository.update(userId, newData);
    }

    public async delete(userId: number): Promise<{ id: number }> {
        return userRepository.delete(userId);
    }

}

export const userService = new UserService();