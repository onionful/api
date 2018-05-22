import { db } from '../utils';

const { Joi, model } = db;

export default model('Space', {
  id: {
    type: String,
    hashKey: true,
    required: true,
    validator: Joi.string()
      .alphanum()
      .min(3),
  },
  name: {
    type: String,
    required: true,
    validator: Joi.string(),
  },
  createdBy: {
    type: String,
    required: true,
    validator: Joi.string(),
  },
});
