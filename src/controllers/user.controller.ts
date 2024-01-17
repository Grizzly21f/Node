import {Request, Response} from "express";

import {userService} from "../services/user.service";
import {IUser} from "../interfaces/user.nterface";

class UserController {
    public async getAll(req: Request, res: Response) {
        try {
            const users = await userService.getAll();

            return res.json({ data: users });
        } catch (e) {
           ;
        }
    }

    public async getAllById(req: Request, res: Response) {
        try {
            const id = req.params.id;

            const user = await userService.getAllById(id);

            res.json({ data: user });
        } catch (e) {
            ;
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const body = req.body as Partial<IUser>;

            const user = await userService.update(id, body);

            res.status(201).json(user);
        } catch (e) {
            ;
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const id = req.params.id;

            await userService.delete(id);

            res.sendStatus(204);
        } catch (e) {
            ;
        }
    }
}





export const userControler = new UserController()