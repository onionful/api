import { ContentModel } from 'models';
import { Content } from 'types';
import { db, uuid, wrapper } from 'utils';
import { parse } from './.helpers';

interface Params {
  collection: string;
}

// TODO not everyone should be allowed to create new spaces
export default wrapper<Params, Content, Content>(
  ({
    headers: { Space: space },
    pathParameters: { collection },
    body: { id, ...data },
    user: { id: createdBy },
  }) =>
    ContentModel.create({
      key: db.complexId(space, collection),
      id: id || uuid(),
      data,
      createdBy,
    }).then(parse),
);
