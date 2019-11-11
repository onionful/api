import { SpaceModel } from 'models';
import { errors, wrapper } from 'utils';

// TODO: delete only if user is allowed to do it
export default wrapper(({ pathParameters: { id } }) =>
  // SpaceModel.delete({ id }, { condition: 'attribute_exists(id)' }).catch(({ message }) => {
  SpaceModel.delete({ id }).catch(({ message }) => {
    throw new errors.NotFound(message);
  }),
);
