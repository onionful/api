import { Space } from 'models';
import { wrapper } from 'utils';

// TODO list spaces for the current user only
export default wrapper(() => Space.scan().exec());
