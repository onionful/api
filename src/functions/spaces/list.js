import { Space } from 'models';
import { wrapper } from 'utils';

export default wrapper(() => Space.scan().exec());
