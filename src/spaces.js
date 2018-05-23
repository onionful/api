import { mapValues, snakeCase } from 'lodash';
import { Space } from './models';
import { errors, wrapper, verify } from './utils';

const create = ({ body: { name, ...rest } }) =>
  Space.create({ ...rest, id: snakeCase(name), name });

const update = ({ body, pathParameters: { id } }) =>
  Space.update({ id }, body, { condition: 'attribute_exists(id)' }).catch(({ message }) => {
    throw new errors.NotFound(message);
  });

const get = ({ pathParameters: { id } }) => Space.get({ id }).then(verify.presence);

const list = () => Space.scan().exec();

module.exports = mapValues({ create, update, get, list }, wrapper);
