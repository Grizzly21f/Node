import { configs } from "../configs/config";
import {IUser} from "../interfaces/user.nterface";


export class UserPresenter {
    public static userToResponse(user: IUser) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            age: user.age,
            Verified: user.Verified,
            createdAt: user.createdAt,
            avatar: user?.avatar ? `${configs.AWS_S3_URL}${user?.avatar}` : null,
        };
    }
}