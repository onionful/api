import { omit } from 'lodash';
import { Content } from 'models';
import { db, errors, wrapper } from 'utils';
import { parse } from './.helpers';

export default wrapper(({ headers: { Space: space }, body, pathParameters: { collection, id } }) =>
  Content.updateWithId({ key: db.complexId(space, collection), id }, { id }, previousBody =>
    Object.assign(previousBody, {
      id: body.id,
      data: omit(body, ['id', 'createdBy', 'space', 'collection']),
    }),
  )
    .then(parse)
    .catch(({ message }) => {
      throw new errors.NotFound(message);
    }),
);
