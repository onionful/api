import { SpaceModel } from 'models';
import { wrapper } from 'utils';

// TODO list spaces for the current user only
export default wrapper(() =>
  SpaceModel.scan()
    .exec()
    .then(response =>
      response.map(space => ({
        owners: [],
        users: [],
        ...space,
      })),
    ),
);
