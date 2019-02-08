import { Content } from 'models';
import { uuid, wrapper } from 'utils';
import { parse } from './.helpers';

// TODO not everyone should be allowed to create new spaces
export default wrapper(
  ({ headers: { Space: space }, body: { id, ...data }, user: { id: createdBy } }) =>
    Content.create({ id: id || uuid(), space, data, createdBy }).then(parse),
);
