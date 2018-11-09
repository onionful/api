import { snakeCase } from 'lodash';
import { Space } from 'models';
import { wrapper } from 'utils';

export default wrapper(({ body: { name, ...rest } }) =>
  Space.create({ ...rest, id: snakeCase(name), name }),
);
