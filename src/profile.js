import { pick } from 'lodash';
import { userFields, wrapper } from './utils';
import validators from './validators';

const get = (params, { Auth0, User: { sub: id, roles, permissions, groups } }) =>
  Auth0.getUser({ id }).then(user => ({ ...pick(user, userFields), roles, permissions, groups }));

const update = ({ body }, { Auth0, User: { sub: id } }) =>
  validators
    .UserAppMetadata(body)
    .then(metadata => Auth0.updateUserMetadata({ id }, metadata))
    .then(user => pick(user, userFields));

module.exports = {
  get: wrapper(get, { withAuth0: true, checkPermission: 'users:list' }),
  update: wrapper(update, { withAuth0: true, checkPermission: 'users:list' }),
};
