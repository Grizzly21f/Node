import { model, Schema } from "mongoose";
import {IUser} from "../interfaces/user.nterface";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
        },
        age: {
            type: Number,
            min: 1,
            max: 55,
            required: true,
        },
        Verified: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const User = model<IUser>("user", userSchema);