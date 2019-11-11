import { CollectionModel } from 'models';
import { verify, wrapper } from 'utils';

export default wrapper(({ headers: { Space: space }, pathParameters: { id } }) =>
  CollectionModel.get({ space, id })
    .then(verify.presence)
    .then(() => CollectionModel.delete({ space, id })),
);
