import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";



class CommonMiddleware {
    public isIdValid(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;

            if (!isObjectIdOrHexString(id)) {


            }

            next();
        } catch (e) {
            next(e);
        }
    }

    public isBodyValid(validator: ObjectSchema) {
        return function (req: Request, res: Response, next: NextFunction) {
            try {
                const { value,  } = validator.validate(req.body);


                req.body = value;
//
                next();
            } catch (e) {
                next(e);
            }
        };
    }
}

export const commonMiddleware = new CommonMiddleware();