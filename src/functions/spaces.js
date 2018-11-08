import { snakeCase } from 'lodash';
import { Space } from 'models';
import { errors, verify, wrapper } from 'utils';

export const create = wrapper(({ body: { name, ...rest } }) =>
  Space.create({ ...rest, id: snakeCase(name), name }),
);

export const update = wrapper(({ body, pathParameters: { id } }) =>
  Space.update({ id }, body, { condition: 'attribute_exists(id)' }).catch(({ message }) => {
    throw new errors.NotFound(message);
  }),
);

export const get = wrapper(({ pathParameters: { id } }) => Space.get({ id }).then(verify.presence));

export const list = wrapper(() => Space.scan().exec());
