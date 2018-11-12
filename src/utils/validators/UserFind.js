import { Joi } from 'utils';

export default {
  query: Joi.string()
    .trim()
    .min(3),
};
