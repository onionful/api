import { db } from '../utils';

const { Joi, model } = db;

export default model('Space', {
  id: Number,
  name: String,
});
