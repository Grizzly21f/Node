import { FilterQuery } from "mongoose";

import { User } from "../models/user.model";

import { IUser } from "../interfaces/user.nterface";

class UserRepository {
    public async getAll(): Promise<IUser[]> {
        return await User.find({});
    }

    public async getAllById(id: string): Promise<IUser> {
        return await User.findOne({ _id: id });
    }

    public async getOneByParams(params: FilterQuery<IUser>): Promise<IUser> {
        return await User.findOne(params);
    }

    public async update(id: string, body: Partial<IUser>): Promise<IUser> {
        return await User.findByIdAndUpdate(id, body, { returnDocument: "after" });
    }

    public async create(body: Partial<IUser>): Promise<IUser> {
        return await User.create(body);
    }

    public async delete(id: string): Promise<void> {
        await User.deleteOne({ _id: id });
    }
}

export const userRepository = new UserRepository();