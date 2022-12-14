import * as companyRepository from '../repositories/companyRepository';
import * as employeeRepository from '../repositories/employeeRepository';
import * as cardRepository from '../repositories/cardRepository'
import * as transactionServices from '../services/transactionServices'
import { Company } from '../repositories/companyRepository';
import { Employee } from '../repositories/employeeRepository';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from 'cryptr';
import { config } from 'dotenv';
import bcrypt from 'bcrypt';


config();
const cryptr= new Cryptr(process.env.CRYPTRKEY||'pato')

export async function registerNewCard(
    apiKey:any,
    body:{employeeId:number,isVirtual:boolean,type:cardRepository.TransactionTypes})
    :Promise<{code:number,message:string}>{

    const company:(Company|undefined) = await companyRepository.findByApiKey(apiKey)
    if(!company){
        return {code:404,message:"Company not found"};
    }
    const employee:(Employee|undefined)=await  employeeRepository.findById(body.employeeId);
    if(!employee){
        return {code:404,message:"Employee not found"};
    }
    const cardAlreadyExists:(cardRepository.Card|undefined)=await cardRepository.findByTypeAndEmployeeId(body.type,body.employeeId);
    if(cardAlreadyExists){
        return {code:409,message:"Employee already has a card of this type"};
    }
    const cardNumber= faker.finance.creditCardNumber();
    let nameArray=employee.fullName.split(" ");
    nameArray=nameArray.filter((entry:string)=> {
        return (entry.toLowerCase()!=="da"&&entry.toLowerCase()!=="de")
    })
    let cardName:string=nameArray[0];
    for(let i=1;i<nameArray.length-1;i++){
        cardName+=" "+nameArray[i][0];
    }
    cardName+=" "+nameArray.slice(-1);
    cardName=cardName.toUpperCase();
    const expirationDate=dayjs().add(5,'year').format('MM/YY');
    const cvc =faker.finance.creditCardCVV()
    console.log(cvc)
    const encryptedcvc = cryptr.encrypt(cvc);

    const newCard:cardRepository.CardInsertData = {
        employeeId:body.employeeId,
        number:cardNumber,
        cardholderName:cardName,
        securityCode:encryptedcvc,
        expirationDate:expirationDate,
        isVirtual:body.isVirtual,
        isBlocked:false,
        type:body.type
    }
    await cardRepository.insert(newCard);
    return {code:201,message:"Created with CVC "+cvc};
}
export async function activateCard(
    body:{
        cardId:number,
        cvc:string,
        password:string
    }):Promise<{code:number,message:string}>{    
    const card:(cardRepository.Card|undefined)=await cardRepository.findById(body.cardId);
    if(!card){
        return {code:401,message:"Some or all of card information is invalid"}
    }
    const decriptedCvc=cryptr.decrypt(card.securityCode)
    if(body.cvc!==decriptedCvc){
        return {code:401,message:"Invalid security code"}
    }
    if(await checkActivation(card)){
        return {code:409,message:"Card is already active"}
    }
    if(await checkIfExpired(card)){
        return {code:401,message:"Card already expired"}
    }
    const hashedPassword = bcrypt.hashSync(body.password,10);

    await cardRepository.update(card.id,{password:hashedPassword})
    return {code:200,message:"Card activated"}

}
export async function blockCard(
    body:{
        cardId:number,
        password:string
    }):Promise<{code:number,message:string}>{
    const card:(cardRepository.Card)=await cardRepository.findById(body.cardId);
    const comparePassword = bcrypt.compareSync(body.password,card.password||"undefined")
    if(!card){
        return {code:404,message:"Card not found"}
    }
    if(!comparePassword){
        return {code:401,message:"Invalid password"}
    }
    if(await checkIfExpired(card)){
        return {code:409,message:"Card already expired"}
    }
    if(card.isBlocked){
        return {code:409,message:"Card already blocked"}
    }
    await cardRepository.update(card.id,{isBlocked:true})

    return {code:200,message:"Card blocked"}
}
export async function unblockCard(
    body:{
        cardId:number,
        password:string
    }):Promise<{code:number,message:string}>{
    const card:(cardRepository.Card)=await cardRepository.findById(body.cardId);
    const comparePassword = bcrypt.compareSync(body.password,card.password||"undefined")
    if(!card){
        return {code:404,message:"Card not found"}
    }
    if(!comparePassword){
        return {code:401,message:"Invalid password"}
    }
    if(await checkIfExpired(card)){
        return {code:401,message:"Card already expired"}
    }
    if(!card.isBlocked){
        return {code:409,message:"Card not blocked"}
    }
    await cardRepository.update(card.id,{isBlocked:false})

    return {code:200,message:"Card unblocked"}
}
export async function viewBalance(body:{cardId:number}){
    const card:(cardRepository.Card)=await cardRepository.findById(body.cardId);
    if(!card){
        return {code:404,message:"Card not found"}
    }
    return await transactionServices.checkBalance(body.cardId)
}

export async function checkActivation(card:cardRepository.Card){
    if(card.password){
        return true;
    }
    return false;
}
export async function checkIfExpired(card:cardRepository.Card){
    if(dayjs().isAfter(dayjs(card.expirationDate,"MM-YY"))){
    return false;
    }
    return true;

}
