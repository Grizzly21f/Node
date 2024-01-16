import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';

class UserMiddleware {
    public validateUserId(req: Request, res: Response, next: NextFunction) {
        const userId = +req.params.id;

        if (isNaN(userId) || userId <= 0) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        next();
    }

    public validateUserName(req: Request, res: Response, next: NextFunction) {
        const { name } = req.body;

        if (!name || name.length <= 3) {
            return res.status(400).json({ error: 'Name should be more than 3 characters' });
        }

        next();
    }

    public async validateUserNotExist(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.body;

            if (id <= 0) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }

            if (id && await userService.getAllById(id)) {
                return res.status(400).json({ error: 'User with this ID already exists' });
            }

            next();
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

const userMiddleware = new UserMiddleware();
export default userMiddleware;
