import { CollectionModel } from 'models';
import { verify, wrapper } from 'utils';
import { parse } from './.helpers';

export default wrapper(({ headers: { Space: space }, pathParameters: { id } }) =>
  CollectionModel.get({ space, id })
    .then(verify.presence)
    .then(parse),
);
