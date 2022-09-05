import * as rechargeRepository from '../repositories/rechargeRepository'
import * as paymentRepository from '../repositories/paymentRepository'
import * as cardRepository from '../repositories/cardRepository'
import * as businessRepository from '../repositories/businessRepository'
import { Card } from '../repositories/cardRepository'
import { checkActivation, checkIfExpired } from './cardServices'
import { number } from 'joi'
import bcrypt from 'bcrypt'

export async function recharge(body:{cardId:number,amount:number})
:Promise<{code:number,message:string}>{
    const card:Card=await cardRepository.findById(body.cardId)
    if(!card){
        return {code:404,message:"Card not found"}
    }
    if(!await checkActivation(card)){
        return {code:401,message:"Card must be active"}
    }
    if(await checkIfExpired(card)){
        return {code:401,message:"Card already expired"}
    }
    const rechargeInfo:rechargeRepository.RechargeInsertData={cardId:card.id,amount:body.amount}
    await rechargeRepository.insert(rechargeInfo)
    return {code:200,message:"Succesful Recharge"}
}
export async function payment(body:{cardId:number,password:string,amount:number,businessId:number})
:Promise<{code:number,message:string}>{
    const card:Card=await cardRepository.findById(body.cardId)
    if(!card){
        return {code:404,message:"Card not found"}
    }
    if(!await checkActivation(card)){
        return {code:401,message:"Card must be active"}
    }
    if(await checkIfExpired(card)){
        return {code:409,message:"Card already expired"}
    }
    if(card.isBlocked){
        return {code:401,message:"Card must not be blocked"}
    }
    const comparePassword = bcrypt.compareSync(body.password,card.password||"undefined")
    if(!comparePassword){
        return {code:409,message:"Invalid password"}
    }
    const business:businessRepository.Business=await businessRepository.findById(body.businessId);
    if(!business){
        return{code:404,message:"Business not found"}
    }
    if(card.type!==business.type){
        return {code:401,message:"This card is invalid for this business type"}
    }
    const balance=(await checkBalance(card.id)).balance;
    if(body.amount>balance){
        return {code:409,message:"Your balance is insuficient for this transaction"}
    }
    const paymentInfo:paymentRepository.PaymentInsertData={cardId:card.id,businessId:body.businessId,amount:body.amount}
    await paymentRepository.insert(paymentInfo);
    return {code:200,message:"Payment successful"}
}
export async function checkBalance(cardId:number):Promise<{balance:number,transactions:any,recharges:any}>{
    const payments=await paymentRepository.findByCardId(cardId)
    const recharges=await rechargeRepository.findByCardId(cardId)
    let totalRecharged=0;
    recharges.forEach((entry)=>{
        totalRecharged+=entry.amount
    })
    let totalPayed=0;
    payments.forEach((entry)=>{
        totalPayed+=entry.amount
    })
    const balance=totalRecharged-totalPayed
    return {balance,transactions:payments,recharges}
}
