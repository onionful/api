import Joi from 'joi';

export default Joi.extend(joi => ({
  name: 'id',
  base: joi
    .string()
    .regex(/^[a-z0-9-]+$/)
    .lowercase()
    .min(3)
    .max(64)
    .truncate(),
}));
