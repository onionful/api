import { mapValues, snakeCase } from 'lodash';
import { Space } from './models';
import { wrapper } from './utils';

const create = ({ body: { name, ...rest } }) =>
  Space.create({ ...rest, id: snakeCase(name), name });

const update = ({ body, pathParameters: { id } }) => Space.update({ id }, body);

const get = ({ pathParameters: { id } }) => Space.get({ id });

const list = () => Space.scan().exec();

module.exports = mapValues({ create, update, get, list }, wrapper);
