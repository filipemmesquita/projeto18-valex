import * as companyRepository from '../repositories/companyRepository';
import * as employeeRepository from '../repositories/employeeRepository';
import * as cardRepository from '../repositories/cardRepository'
import { Company } from '../repositories/companyRepository';
import { Employee } from '../repositories/employeeRepository';
import { CardInsertData } from '../repositories/cardRepository';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import Cryptr from 'cryptr';
import { config } from 'dotenv';
import bcrypt from 'bcrypt';


config();
const cryptr= new Cryptr(process.env.CRYPTRKEY||'pato')

export async function registerNewCard(apiKey:any,body:any):Promise<string>{
    const company:(Company|undefined) = await companyRepository.findByApiKey(apiKey)
    if(!company){
        return "404 company not found";
    }
    const employee:(Employee|undefined)=await  employeeRepository.findById(body.employeeId);
    if(!employee){
        return "404 employee not found";
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
    
    const cvc = cryptr.encrypt(faker.finance.creditCardCVV());
    const hashedPassword = bcrypt.hashSync(body.password,10);
    const newCard:CardInsertData = {
        employeeId:body.employeeId,
        number:cardNumber,
        cardholderName:cardName,
        securityCode:cvc,
        expirationDate:expirationDate,
        password:hashedPassword,
        isVirtual:body.isVirtual,
        isBlocked:false,
        type:body.type
    }
    await cardRepository.insert(newCard);
    return "201 Created";


}