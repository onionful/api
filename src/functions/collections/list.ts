import { CollectionModel } from 'models';
import { wrapper } from 'utils';
import { parse } from './.helpers';

export default wrapper(({ headers: { Space: space } }) =>
  CollectionModel.query('space')
    .eq(space)
    .exec() // TODO check why it takes Regexp
    .then(items => items.map(parse)),
);
