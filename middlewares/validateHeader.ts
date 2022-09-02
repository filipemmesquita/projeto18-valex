import { Request, Response,NextFunction } from "express";
import joi from "joi";

export async function validateHeader(req:Request,res:Response,next:NextFunction){
    const apiSchema=joi.object({
        apiKey:joi.string().required()
    })
    const apiKey=req.headers['x-api-key'];
    console.log(apiKey)
    const validate=apiSchema.validate({apiKey:apiKey});
    if(validate.error){
        return res.status(422).send(validate.error.details)
    }
    next();
}