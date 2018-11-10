import { snakeCase } from 'lodash';
import { Space } from 'models';
import { wrapper } from 'utils';

// TODO not everyone should be allowed to create new spaces
export default wrapper(({ body: { name, ...rest } }) =>
  Space.create({ ...rest, id: snakeCase(name), name }),
);
