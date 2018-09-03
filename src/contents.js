import uuid from 'uuid/v4';
import { Content } from './models';
import { errors, verify, wrapper } from './utils';

const parse = content => content;

export const create = wrapper(({ headers: { Space: space }, body: { id, ...data } }) =>
  Content.create({ ...data, id: id || uuid(), space }).then(parse),
);

export const update = wrapper(({ headers: { Space: space }, body, pathParameters: { id } }) =>
  Content.update({ space, id }, body, { condition: 'attribute_exists(id)' })
    .then(parse)
    .catch(({ message }) => {
      throw new errors.NotFound(message);
    }),
);

export const get = wrapper(({ headers: { Space: space }, pathParameters: { id } }) =>
  Content.get({ space, id })
    .then(verify.presence)
    .then(parse),
);

export const list = wrapper(({ headers: { Space: space } }) =>
  Content.query('space')
    .eq(space)
    .exec()
    .then(items => items.map(parse)),
);
