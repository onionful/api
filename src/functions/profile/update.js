import { pick } from 'lodash';
import { userFields, validators, wrapper } from 'utils';

export default wrapper(
  ({ body, user: { id } }, { Auth0 }) =>
    validators
      .UserAppMetadata(body)
      .then(metadata => Auth0.updateUserMetadata({ id }, metadata))
      .then(user => pick(user, userFields)),
  { withAuth0: true, checkPermission: 'users:list' },
);
