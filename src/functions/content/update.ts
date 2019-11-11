import { omit } from 'lodash';
import { ContentModel } from 'models';
import { Content } from 'types';
import { db, errors, wrapper } from 'utils';
import { parse } from './.helpers';

interface Params {
  collection: string;
  id: string;
}

export default wrapper<Params, Content, Content>(
  ({ headers: { Space: space }, body, pathParameters: { collection, id } }) =>
    ContentModel.updateWithId({ key: db.complexId(space, collection), id }, { id }, previousBody =>
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
