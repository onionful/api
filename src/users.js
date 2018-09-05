import { omitBy } from 'lodash';
import { wrapper, userFields } from './utils';

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

export const list = wrapper(
  ({ queryStringParameters }, { Auth0 }) =>
    Auth0.getUsers({ ...pagination(queryStringParameters), fields: userFields.join() }),
  { withAuth0: true, checkPermission: 'users:list' },
);
