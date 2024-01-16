import {read ,write} from "../fs.service";
import {IUser} from "../interfaces/user.nterface";

class UserRepository {
    public async getAll(): Promise<IUser[]> {
       const jsonData = await read();

       return jsonData;
    }

    public async write(jsonData): Promise<void> {
        await write(jsonData);
    }
}

export const userRepository = new UserRepository();