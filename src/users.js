import { omitBy } from 'lodash';
import { wrapper } from './utils';

const pagination = ({ limit, page, sort, order, q }) =>
  omitBy(
    {
      include_totals: true,
      search_engine: 'v3',
      per_page: limit,
      page,
      sort: sort && `${sort}:${(order || '').toLowerCase().startsWith('desc') ? -1 : 1}`,
      q,
    },
    v => v === undefined,
  );

const list = ({ queryStringParameters }, { Auth0 }) =>
  Auth0.getUsers({
    ...pagination(queryStringParameters),
    fields: 'email,name,nickname,picture,created_at,last_login,logins_count',
  });

module.exports = {
  list: wrapper(list, { withAuth0: true, checkPermission: 'users:list' }),
};
