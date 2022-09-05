import joi from 'joi';

const blockSchema = joi.object({
    cardId: joi.number().required(),
    password:joi.string().min(4).max(4).pattern(/^[0-9]/).required()
  });

export default blockSchema;