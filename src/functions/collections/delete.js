import { Collection } from 'models';
import { wrapper } from 'utils';
import { parse } from './.helpers';

export default wrapper(({ headers: { Space: space }, pathParameters: { id } }) =>
  Collection.delete({ space, id }).then(parse),
);
