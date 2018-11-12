import { Collection } from 'models';
import { verify, wrapper } from 'utils';

export default wrapper(({ headers: { Space: space }, pathParameters: { id } }) =>
  Collection.get({ space, id })
    .then(verify.presence)
    .then(() => Collection.delete({ space, id })),
);
