import { Space } from 'models';
import { errors, wrapper } from 'utils';

export default wrapper(({ body, pathParameters: { id } }) =>
  Space.update({ id }, body, { condition: 'attribute_exists(id)' }).catch(({ message }) => {
    throw new errors.NotFound(message);
  }),
);
