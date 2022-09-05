import * as rechargeRepository from '../repositories/rechargeRepository'
import * as paymentRepository from '../repositories/paymentRepository'
import * as cardRepository from '../repositories/cardRepository'
import { Card } from '../repositories/cardRepository'
import { checkIfExpired } from './cardServices'
import { number } from 'joi'

export async function recharge(body:{cardId:number,amount:number}):Promise<{code:number,message:string}>{
    const card:Card=await cardRepository.findById(body.cardId)
    if(!card){
        return {code:404,message:"Card not found"}
    }
    if(!card.password){
        return {code:401,message:"Card must be active"}
    }
    if(await checkIfExpired(card)){
        return {code:401,message:"Card already expired"}
    }
    const rechargeInfo:rechargeRepository.RechargeInsertData={cardId:card.id,amount:body.amount}
    await rechargeRepository.insert(rechargeInfo)
    return {code:200,message:"Succesful Recharge"}
}