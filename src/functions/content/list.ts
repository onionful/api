import { ContentModel } from 'models';
import { db, wrapper } from 'utils';
import { parse } from './.helpers';

export default wrapper(({ headers: { Space: space }, pathParameters: { collection } }) =>
  ContentModel.query('key')
    .eq(db.complexId(space, collection))
    .exec()
    .then(items => items.map(parse)),
);
