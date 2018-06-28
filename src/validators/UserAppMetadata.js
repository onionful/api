import Joi from 'joi';

export default {
  space: Joi.string()
    .token()
    .min(3),
};
