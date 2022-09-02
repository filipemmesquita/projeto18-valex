import { Request, Response } from "express";
import { Company } from "../repositories/companyRepository";
import * as cardServices from "../services/cardServices"

export async function createCard(req:Request,res:Response){
    const apiKey=req.headers['x-api-key'];
    const result = await cardServices.registerNewCard(apiKey,req.body)
    return res.status(result.code).send(result.message);
}
export async function activateCard(req:Request,res:Response){
    const result=await cardServices.activateCard(req.body);    
    return res.status(result.code).send(result.message);
}
export async function blockCard(req:Request,res:Response){
    const result=await cardServices.blockCard(req.body)
    return res.status(result.code).send(result.message)
}