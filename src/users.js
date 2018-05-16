import { pagination, wrapper } from './utils';

const list = ({ queryStringParameters }, { Auth0 }) => Auth0.getUsers({
  ...pagination(queryStringParameters),
  fields: 'email,name,nickname,picture,created_at,last_login,logins_count',
});

module.exports = {
  list: wrapper(list, { withAuth0: true, checkPermission: 'users:list' }),
};
