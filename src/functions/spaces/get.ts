import { SpaceModel } from 'models';
import { verify, wrapper } from 'utils';

// TODO: return specified space only if user has access to it - 404 otherwise
export default wrapper(({ pathParameters: { id } }) =>
  SpaceModel.get({ id }).then(verify.presence),
);
