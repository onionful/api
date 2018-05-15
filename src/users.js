import { wrapper } from './utils';

const list = (params, { Auth0 }) => Auth0.getUsers();

module.exports = {
  list: wrapper(list, { withAuth0: true }),
};
