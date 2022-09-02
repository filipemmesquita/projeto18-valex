import joi from 'joi';

const activateSchema = joi.object({
    cardholderName:joi.string().required(),
    cardNumber: joi.string().required(),
    expirationDate:joi.string().min(5).max(5).required(),
    password:joi.string().min(4).max(4).pattern(/^[0-9]/).required(),
    cvc: joi.string().min(3).max(3).required(),
  });

export default activateSchema;