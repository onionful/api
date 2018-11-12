import { Joi } from 'utils';

export default {
  query: Joi.string().min(3),
};
