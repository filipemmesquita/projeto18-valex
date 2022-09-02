import { Request, Response } from "express";
import { Company } from "../repositories/companyRepository";
import * as cardServices from "../services/cardServices"

export async function createCard(req:Request,res:Response){
    const apiKey=req.headers['x-api-key'];
    const result = await cardServices.registerNewCard(apiKey,req.body)
    const code=result.split(' ')[0]
    const message=result.split(' ')[1]
    return res.status(Number(code)).send(message);
}