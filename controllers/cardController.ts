import { Request, Response } from "express";
import { Company } from "../repositories/companyRepository";
import * as cardServices from "../services/cardServices"

export async function createCard(req:Request,res:Response){
    try{
        const apiKey=req.headers['x-api-key'];
        const result = await cardServices.registerNewCard(apiKey,req.body)
        return res.status(result.code).send(result.message);
    } catch (error:any) {
        console.log(error.message);
        return res.status(500).send('Unexpected error')
    }
}
export async function activateCard(req:Request,res:Response){
    try{const result=await cardServices.activateCard(req.body);    
        return res.status(result.code).send(result.message);}
    catch (error:any) {
        console.log(error.message);
        return res.status(500).send('Unexpected error')
    }
}
export async function blockCard(req:Request,res:Response){
    try
    {
        const result=await cardServices.blockCard(req.body)
    return res.status(result.code).send(result.message)}
    catch (error:any) {
        console.log(error.message);
        return res.status(500).send('Unexpected error')
    }
}
export async function unblockCard(req:Request,res:Response){
    try
    {
        const result=await cardServices.unblockCard(req.body)
    return res.status(result.code).send(result.message)}
    catch (error:any) {
        console.log(error.message);
        return res.status(500).send('Unexpected error')
    }
}
export async function displayBalance(req:Request,res:Response){
    try{
        const result=await cardServices.viewBalance(req.body)
    return res.status(200).send(result);}
    catch (error:any) {
        console.log(error.message);
        return res.status(500).send('Unexpected error')
    }
}