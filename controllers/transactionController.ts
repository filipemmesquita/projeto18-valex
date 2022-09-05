import { Request, Response } from "express";
import * as transactionServices from "../services/transactionServices"

export async function rechargeCard(req:Request,res:Response){
    const result=await transactionServices.recharge(req.body)
    return res.status(result.code).send(result.message)
}
export async function cardPayment(req:Request,res:Response){
    const result=await transactionServices.payment(req.body)
    return res.status(result.code).send(result.message)
}