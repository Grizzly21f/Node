import {userRepository} from "../repositories/user.repository";
import {IUser} from "../interfaces/user.nterface";
import {User} from "../models/user.model";

class UserService {
    public async getAll ():Promise<IUser[]> {
        const users = await userRepository.getAll();
        return users;
    }

    public async getAllById(userId: number): Promise<IUser | undefined> {
        try {
            if (userId <= 0) {
                throw new Error('Invalid user ID');
            }

            const users = await userRepository.getById(userId.toString()); // Викликати getById з userId

            if (!users) {
                throw new Error('User not found');
            }

            return users;
        } catch (error) {
            throw error;
        }
    }

    public async create(newData: IUser): Promise<IUser> {
        try {
            if (!newData.name || newData.name.length <= 3) {
                throw new Error('Name should be provided and more than 3 characters');
            }

            const users = await userRepository.getAll();

            newData.id = users.length + 1;

            users.push(newData);

            await userRepository.create(newData); // Викликати метод create із новим користувачем, а не масивом користувачів

            return newData;
        } catch (error) {
            throw error;
        }
    }


    public async update(userId: number, newData: IUser): Promise<IUser> {
        try {
            const updatedUser = await User.findByIdAndUpdate(userId.toString(), newData, { new: true });

            if (!updatedUser) {
                throw new Error('User not found');
            }

            return updatedUser;
        } catch (error) {
            throw error;
        }
    }




    public async delete(userId: number): Promise<{ id: number }> {
        try {
            const users = await userRepository.getAll();
            const userIndex = users.findIndex((user: IUser) => user.id === userId);

            if (userIndex === -1) {
                throw new Error('User not found');
            }

            const deletedUser = users.splice(userIndex, 1)[0];
            await userRepository.deleteById(userId.toString()); // Викликати метод deleteById із параметром userId

            return { id: deletedUser.id };
        } catch (error) {
            throw error;
        }
    }



}

export const userService = new UserService();