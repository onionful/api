import { kebabCase, sortBy } from 'lodash';
import { Collection } from './models';
import { verify, wrapper } from './utils';

const parse = ({ fields, ...content }) => ({
  fields: sortBy(fields || [], 'order').map(({ order, ...field }) => field),
  ...content,
});

export const create = wrapper(({ headers: { Space: space }, body }) => {
  const id = kebabCase(body.id || body.name);

  return Collection.get({ space, id })
    .then(verify.conflict)
    .then(() => Collection.create({ ...body, id, space }).then(parse));
});

export const update = wrapper(({ headers: { Space: space }, body, pathParameters: { id } }) =>
  Collection.get({ space, id })
    .then(verify.presence)
    .then(previous => {
      const fields = (body.fields || previous.fields).map((field, order) => ({ ...field, order }));

      const newId = kebabCase(body.id);
      if (!newId || id === newId) {
        // regular update, no id changed
        return Collection.update(
          { space, id },
          { ...body, fields },
          { condition: 'attribute_exists(id)' },
        );
      }

      return Collection.get({ space, id: newId })
        .then(verify.conflict)
        .then(() => Collection.create({ ...previous, ...body, fields, space, id: newId }))
        .then(collection => Collection.delete({ id, space }).then(() => collection));
    })
    .then(parse),
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

export const remove = wrapper(({ headers: { Space: space }, pathParameters: { id } }) =>
  Collection.delete({ space, id }).then(parse),
);
