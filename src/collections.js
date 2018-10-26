import { sortBy } from 'lodash';
import { Collection } from './models';
import { errors, verify, wrapper } from './utils';

const parse = ({ fields, ...content }) => ({
  fields: sortBy(fields || [], 'order').map(({ order, ...field }) => field),
  ...content,
});

export const create = wrapper(({ headers: { Space: space }, body }) =>
  Collection.create({ ...body, space }).then(parse),
);

export const update = wrapper(
  ({ headers: { Space: space }, body: { fields, ...body }, pathParameters: { id } }) =>
    Collection.update(
      { space, id },
      { fields: fields.map((field, order) => ({ ...field, order })), ...body },
      { condition: 'attribute_exists(id)' },
    )
      .then(parse)
      .catch(({ message }) => {
        throw new errors.NotFound(message);
      }),
);

export const get = wrapper(({ headers: { Space: space }, pathParameters: { id } }) =>
  Collection.get({ space, id })
    .then(verify.presence)
    .then(parse),
);

export const list = wrapper(({ headers: { Space: space } }) =>
  Collection.query('space')
    .eq(space)
    .exec()
    .then(items => items.map(parse)),
);
