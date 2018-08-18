import { mapValues } from 'lodash';
import { ContentType } from './models';
import { errors, verify, wrapper } from './utils';

const parse = content => ({ fields: [], ...content });

const create = ({ headers: { Space: space }, body }) =>
  ContentType.create({ ...body, space }).then(parse);

const update = ({ headers: { Space: space }, body, pathParameters: { id } }) =>
  ContentType.update({ space, id }, body, { condition: 'attribute_exists(id)' })
    .then(parse)
    .catch(({ message }) => {
      throw new errors.NotFound(message);
    });

const get = ({ headers: { Space: space }, pathParameters: { id } }) =>
  ContentType.get({ space, id })
    .then(verify.presence)
    .then(parse);

const list = ({ headers: { Space: space } }) =>
  ContentType.query('space')
    .eq(space)
    .exec()
    .then(items => items.map(parse));

module.exports = mapValues({ create, update, get, list }, wrapper);
