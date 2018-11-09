import { Space } from 'models';
import { errors, wrapper } from 'utils';

export default wrapper(({ pathParameters: { id } }) =>
  Space.delete({ id }, { condition: 'attribute_exists(id)' }).catch(({ message }) => {
    throw new errors.NotFound(message);
  }),
);
