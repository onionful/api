import { mapValues } from 'lodash';
import uuid from 'uuid/v4';
import { Content } from './models';
import { errors, verify, wrapper } from './utils';

const parse = content => content;

const create = ({ headers: { Space: space }, body: { id, ...data } }) =>
  Content.create({ ...data, id: id || uuid(), space }).then(parse);

const update = ({ headers: { Space: space }, body, pathParameters: { id } }) =>
  Content.update({ space, id }, body, { condition: 'attribute_exists(id)' })
    .catch(({ message }) => {
      throw new errors.NotFound(message);
    })
    .then(parse);

const get = ({ headers: { Space: space }, pathParameters: { id } }) =>
  Content.get({ space, id })
    .then(verify.presence)
    .then(parse);

const list = ({ headers: { Space: space } }) =>
  Content.query('space')
    .eq(space)
    .exec()
    .then(items => items.map(parse));

module.exports = mapValues({ create, update, get, list }, wrapper);
