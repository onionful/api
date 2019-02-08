import { Content } from 'models';
import { db, uuid, wrapper } from 'utils';
import { parse } from './.helpers';

// TODO not everyone should be allowed to create new spaces
export default wrapper(
  ({
    headers: { Space: space },
    pathParameters: { collection },
    body: { id, ...data },
    user: { id: createdBy },
  }) =>
    Content.create({
      key: db.complexId([space, collection]),
      id: id || uuid(),
      data,
      createdBy,
    }).then(parse),
);
