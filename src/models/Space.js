import { db } from '../utils';

const { Joi, model } = db;

export default model(
  'Space',
  {
    id: {
      type: String,
      hashKey: true,
      required: true,
      validator: Joi.string()
        .token()
        .min(3),
    },
    name: {
      type: String,
      required: true,
      validator: Joi.string(),
    },
    url: {
      type: String,
      validator: Joi.string().uri(),
    },
    createdBy: {
      type: String,
      required: true,
      validator: Joi.string(),
    },
  },
  {
    timestamps: true,
  },
);
