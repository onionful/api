import { Space } from 'models';
import { verify, wrapper } from 'utils';

// TODO: return specified space only if user has access to it - 404 otherwise
export default wrapper(({ pathParameters: { id } }) => Space.get({ id }).then(verify.presence));
