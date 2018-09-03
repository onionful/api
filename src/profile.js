import { pick } from 'lodash';
import { userFields, wrapper } from './utils';
import validators from './validators';

export const get = wrapper(
  (params, { Auth0, User: { sub: id, roles, permissions, groups } }) =>
    Auth0.getUser({ id }).then(user => ({ ...pick(user, userFields), roles, permissions, groups })),
  { withAuth0: true, checkPermission: 'users:list' },
);

export const update = wrapper(
  ({ body }, { Auth0, User: { sub: id } }) =>
    validators
      .UserAppMetadata(body)
      .then(metadata => Auth0.updateUserMetadata({ id }, metadata))
      .then(user => pick(user, userFields)),
  { withAuth0: true, checkPermission: 'users:list' },
);
