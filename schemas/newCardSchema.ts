import joi from 'joi';

const newCardSchema = joi.object({
  employeeId: joi.number().required(),
  //password:joi.string().min(4).max(4).pattern(/^[0-9]/).required(),
  isVirtual: joi.bool().required(),
  type:joi.string().valid('groceries', 'restaurant', 'transport', 'education', 'health').required()
});

export default newCardSchema;