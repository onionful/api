import { pick } from 'lodash';
import { userFields, wrapper } from 'utils';

export default wrapper(
  ({ user: { id, roles, permissions, groups } }, { Auth0 }) =>
    Auth0.getUser({ id }).then(user => ({ ...pick(user, userFields), roles, permissions, groups })),
  { withAuth0: true, checkPermission: 'users:list' },
);
