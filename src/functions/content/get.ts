import { ContentModel } from 'models';
import { db, verify, wrapper } from 'utils';
import { parse } from './.helpers';

export default wrapper(({ headers: { Space: space }, pathParameters: { collection, id } }) =>
  ContentModel.get({ key: db.complexId(space, collection), id })
    .then(verify.presence)
    .then(parse),
);
