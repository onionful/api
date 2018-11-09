import { Space } from 'models';
import { verify, wrapper } from 'utils';

export default wrapper(({ pathParameters: { id } }) => Space.get({ id }).then(verify.presence));
