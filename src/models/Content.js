import { db } from '../utils';

const { Joi, model } = db;

export default model(
  'Content',
  {
    space: {
      type: String,
      hashKey: true,
      required: true,
      validator: Joi.string()
        .token()
        .min(3),
    },
    slug: {
      type: String,
      rangeKey: true,
      required: true,
      validator: Joi.string()
        .regex(/^[a-z0-9-]+$/)
        .lowercase()
        .min(3)
        .max(16)
        .truncate(),
    },
    title: {
      type: String,
      required: true,
      validator: Joi.string(),
    },
    content: {
      type: String,
      required: true,
      validator: Joi.string(),
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
