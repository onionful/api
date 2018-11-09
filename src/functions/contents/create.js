import { Content } from 'models';
import { uuid, wrapper } from 'utils';
import { parse } from './.helpers';

export default wrapper(({ headers: { Space: space }, body: { id, ...data } }) =>
  Content.create({ ...data, id: id || uuid(), space }).then(parse),
);
