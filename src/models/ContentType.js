import { db } from '../utils';

const { Joi, model } = db;
export const TYPES = ['string', 'number', 'date'];

export default model(
  'ContentType',
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
      required: true,
      validator: Joi.string()
        .regex(/^[a-z0-9-]+$/)
        .lowercase()
        .min(3)
        .max(16)
        .truncate(),
    },
    name: {
      type: String,
      required: true,
      validator: Joi.string(),
    },
    description: {
      type: String,
      validator: Joi.string(),
    },
    fields: {
      type: [Object],
      validator: Joi.array()
        .items(
          Joi.object()
            .keys({
              type: Joi.string()
                .allow(TYPES)
                .required(),
            })
            .unknown(),
        )
        .required(),
    },
  },
  {
    timestamps: true,
  },
);
