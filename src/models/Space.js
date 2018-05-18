import { db } from '../utils';

const { Joi, model } = db;

export default model('Space', {
  id: {
    type: String,
    validator: Joi.string().alphanum().min(3).required(),
    hashKey: true,
  },
  name: {
    type: String,
    validator: Joi.string().required(),
  },
  createdBy: {
    type: String,
    validator: Joi.string().required(),
  },
});
