import { Content } from 'types';
import { db, Joi } from 'utils';

export default db.model<Content, { key: string; id: string }>(
  'Content',
  {
    key: {
      type: String,
      hashKey: true,
      required: true,
      // validator: Joi.complexId(),
    },
    id: {
      type: String,
      rangeKey: true,
      required: true,
      // validator: Joi.id(),
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
