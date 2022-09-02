
import { Request, Response, NextFunction } from 'express';
import { any } from 'joi';

function validateSchema(schema:any) {
    return (req:Request, res:Response, next:NextFunction) => {
        const body = {...req.body};


        const validate = schema.validate(body, { abortEarly: false });
        if (validate.error) {
            let messages = validate.error.details.map((value:any) => value.message);
            return res.status(422).send(messages.join('\n'));
        }

        res.locals.body = body;
        next();
    };
}

export default validateSchema;