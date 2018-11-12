import { Space } from 'models';
import { errors, wrapper } from 'utils';

// TODO check if user is allowed to update this space
export default wrapper(({ body, pathParameters: { id } }) =>
  Space.updateWithId({ id }, { id }, body).catch(({ message }) => {
    throw new errors.NotFound(message);
  }),
);
