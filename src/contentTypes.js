import { ContentType } from './models';
import { errors, verify, wrapper } from './utils';

const parse = content => ({ fields: [], ...content });

export const create = wrapper(({ headers: { Space: space }, body }) =>
  ContentType.create({ ...body, space }).then(parse),
);

export const update = wrapper(({ headers: { Space: space }, body, pathParameters: { id } }) =>
  ContentType.update({ space, id }, body, { condition: 'attribute_exists(id)' })
    .then(parse)
    .catch(({ message }) => {
      throw new errors.NotFound(message);
    }),
);

export const get = wrapper(({ headers: { Space: space }, pathParameters: { id } }) =>
  ContentType.get({ space, id })
    .then(verify.presence)
    .then(parse),
);

export const list = wrapper(({ headers: { Space: space } }) =>
  ContentType.query('space')
    .eq(space)
    .exec()
    .then(items => items.map(parse)),
);
