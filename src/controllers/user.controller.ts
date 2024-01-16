import {Request, Response} from "express";

import {userService} from "../services/user.service";

class UserController {
    public async getAll(req: Request, res: Response) {
        try {
            const jsonData = await userService.getAll();
            res.json(jsonData);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({error: 'Internal Server Error', details: error.message});
        }

    }

    public async getAllById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = +id;

            const user = await userService.getAllById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const newData = req.body;

            const user = await userService.create(newData);

            res.json(user);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }



    public async update(req: Request, res: Response) {
        const { id } = req.params;
        const userId = +id;
        const newData = req.body;

        try {
            const updatedUser = await userService.update(userId, newData);
            if (updatedUser) {
                res.json(updatedUser);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }


    public async delete(req: Request, res: Response) {
        const { id } = req.params;
        const userId = +id;

        try {
            const deletedUser = await userService.delete(userId);

            if (!deletedUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ id: deletedUser.id });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }



}





export const userControler = new UserController()