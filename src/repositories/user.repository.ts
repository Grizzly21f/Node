// import {read ,write} from "../fs.service";
// import {IUser} from "../interfaces/user.nterface";
//
// class UserRepository {
//     public async getAll(): Promise<IUser[]> {
//        const jsonData = await read();
//
//        return jsonData;
//     }
//
//     public async write(jsonData): Promise<void> {
//         await write(jsonData);
//     }
// }
//
// export const userRepository = new UserRepository();

import { IUser } from '../interfaces/user.nterface';
import { User } from "../models/user.model";

class UserRepository {
    public async getAll(): Promise<IUser[]> {
        return await User.find({});
    }

    public async getById(id: string): Promise<IUser> {
        return await User.findOne({ _id: id });
    }

    public async updateById(id: string, body: Partial<IUser>): Promise<IUser> {
        return await User.findByIdAndUpdate(id, body, { returnDocument: "after" });
    }

    public async create(body: Partial<IUser>): Promise<IUser> {
        return await User.create(body);
    }

    public async deleteById(id: string): Promise<void> {
        await User.deleteOne({ _id: id });
    }
}

export const userRepository = new UserRepository();