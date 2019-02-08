import { Content } from 'models';
import { wrapper } from 'utils';
import { parse } from './.helpers';

export default wrapper(({ headers: { Space: space } }) =>
  Content.query('space')
    .eq(space)
    .exec()
    .then(items => items.map(parse)),
);
