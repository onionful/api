import { mapValues, snakeCase } from 'lodash';
import { wrapper } from './utils';
import { Space } from './models';

const create = ({ body: { name, ...rest } }) =>
  Space.create({ ...rest, id: snakeCase(name), name });

const update = ({ body, pathParameters: { id } }) => Space.update({ id }, body);

const get = ({ pathParameters: { id } }) => Space.get({ id });

const list = () => Space.scan().exec();

module.exports = mapValues({ create, update, get, list }, wrapper);
