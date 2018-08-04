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
    id: {
      type: String,
      rangeKey: true,
      required: false,
      validator: Joi.string()
        .regex(/^[a-z0-9-]+$/)
        .lowercase()
        .min(3)
        .max(16)
        .truncate(),
    },
    data: {
      type: Object,
      required: true,
      validator: Joi.object(),
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
