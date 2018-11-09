import { kebabCase } from 'lodash';
import { Collection } from 'models';
import { verify, wrapper } from 'utils';
import { parse } from './.helpers';

export default wrapper(({ headers: { Space: space }, body, pathParameters: { id } }) =>
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
