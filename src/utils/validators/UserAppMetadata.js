import { Joi } from 'utils';

export default {
  space: Joi.string()
    .token()
    .min(3),
};
