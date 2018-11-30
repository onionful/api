import { db, Joi } from 'utils';

export const TYPES = ['string', 'number', 'date'];

export default db.model(
  'Collection',
  {
    space: {
      type: String,
      hashKey: true,
      required: true,
      validator: Joi.id(),
    },
    id: {
      type: String,
      rangeKey: true,
      required: true,
      validator: Joi.id(),
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
              order: Joi.number(),
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
