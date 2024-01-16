import {read ,write} from "../fs.service";
import {IUser} from "../interfaces/user.nterface";

class UserRepository {
    public async getAll(): Promise<IUser[]> {
       const jsonData = await read();

       return jsonData;
    }

    public async getAllById(userId: number): Promise<IUser> {
        try {
            const users = await this.getAll();

            if (userId <= 0) {
                throw new Error('Invalid user ID');
            }

            const user = users.find((u: IUser) => u.id === userId);

            if (!user) {
                throw new Error('User not found');
            }

            return user;
        } catch (error) {
            throw error;
        }
    }

    public async create(newData: IUser): Promise<IUser> {
        try {
            if (newData.name.length <= 3) {
                throw new Error('Name should be more than 3 characters');
            }

            const jsonData = await read();

            newData.id = jsonData.length + 1;

            jsonData.push(newData);

            await write(jsonData);

            return newData;
        } catch (error) {
            throw error;
        }
    }


    public async update(userId: number, newData: IUser): Promise<IUser> {
        try {
            const jsonData = await read();
            const userIndex = jsonData.findIndex((user: IUser) => user.id === userId);

            if (userIndex === -1) {
                throw new Error('User not found');
            }

            jsonData[userIndex] = { ...jsonData[userIndex], ...newData };

             await write(jsonData);

            return jsonData[userIndex];
        } catch (error) {
            throw error;
        }
    }


    public async delete(userId: number): Promise<{ id: number }> {
        const jsonData = await this.getAll();
        const userIndex = jsonData.findIndex((user: IUser) => user.id === userId);

        if (userIndex === -1) {
            throw new Error('User not found');
        }

        const deletedUser = jsonData.splice(userIndex, 1)[0];
        await write(jsonData);

        return { id: deletedUser.id };
    }

}

export const userRepository = new UserRepository();