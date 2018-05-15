import { wrapper } from './utils';

const list = (params, { Auth0 }) => Auth0.getUsers({
  fields: 'email,name,nickname,picture,created_at,last_login,logins_count',
});

module.exports = {
  list: wrapper(list, { withAuth0: true }),
};
