import { db, Joi } from 'utils';

export default db.model(
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
      validator: Joi.id(),
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
