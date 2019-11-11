import { db, Joi } from 'utils';

export default db.model(
  'Space',
  {
    id: {
      type: String,
      hashKey: true,
      required: true,
      // validator: Joi.id(),
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
    owners: {
      type: [String],
      validator: Joi.array()
        .items(Joi.string())
        .required(),
    },
    users: {
      type: [String],
      validator: Joi.array()
        .items(Joi.string())
        .required(),
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
