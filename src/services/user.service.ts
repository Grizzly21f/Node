import {userRepository} from "../repositories/user.repository";
import {IUser} from "../interfaces/user.nterface";


class UserService {
    public async getAll ():Promise<IUser[]> {
        const users = await userRepository.getAll();
        return users;
    }

    public async getAllById(id: string): Promise<IUser> {
        const user = await userRepository.getAllById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }

    public async create(newData: IUser): Promise<IUser> {
        try {
            if (!newData.name || newData.name.length <= 3) {
                throw new Error('Name should be provided and more than 3 characters');
            }

            const users = await userRepository.getAll();

            newData.id = users.length + 1;

            users.push(newData);

            await userRepository.create(newData);

            return newData;
        } catch (error) {
            throw error;
        }
    }


    public async update(id: string, body: Partial<IUser>): Promise<IUser> {
        const user = await userRepository.getAllById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return await userRepository.update(id, body);
    }




    public async delete(id: string): Promise<void> {
        const user = await userRepository.getAllById(id);
        if (!user) {
            throw new Error("User not found");
        }
        await userRepository.delete(id);
    }



}

export const userService = new UserService();