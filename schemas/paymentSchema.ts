import joi from 'joi';

const paymentSchema = joi.object({
    cardId: joi.number().required(),
    amount:joi.number().min(1).required(),
    password:joi.string().min(4).max(4).pattern(/^[0-9]/).required(),
    businessId:joi.number().required()
  });

export default paymentSchema;