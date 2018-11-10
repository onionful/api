import { Space } from 'models';
import { errors, wrapper } from 'utils';

// TODO: delete only if user is allowed to do it
export default wrapper(({ pathParameters: { id } }) =>
  Space.delete({ id }, { condition: 'attribute_exists(id)' }).catch(({ message }) => {
    throw new errors.NotFound(message);
  }),
);
