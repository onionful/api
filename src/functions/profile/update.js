import { pick } from 'lodash';
import { userFields, wrapper } from 'utils';
import validators from 'validators';

export default wrapper(
  ({ body }, { Auth0, User: { sub: id } }) =>
    validators
      .UserAppMetadata(body)
      .then(metadata => Auth0.updateUserMetadata({ id }, metadata))
      .then(user => pick(user, userFields)),
  { withAuth0: true, checkPermission: 'users:list' },
);
