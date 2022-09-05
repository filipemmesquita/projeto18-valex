import joi from 'joi';

const activateSchema = joi.object({
    cardId: joi.number().required(),
    password:joi.string().min(4).max(4).pattern(/^[0-9]/).required(),
    cvc: joi.string().min(3).max(3).required(),
  });

export default activateSchema;