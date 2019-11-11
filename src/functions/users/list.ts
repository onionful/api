import { omitBy } from 'lodash';
import { User } from 'types';
import { userFields, wrapper } from 'utils';

interface Params {
  limit: number;
  page: string;
  sort: string;
  order: string;
  q: string;
}

const pagination = ({ limit, page, sort, order, q }: Params) =>
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

export default wrapper<Params, User[]>(
  ({ queryStringParameters }, { Auth0 }) =>
    Auth0.getUsers({ ...pagination(queryStringParameters), fields: userFields.join() }).then(
      response => {
        console.log('response', response);
        return [];
      },
    ),
  { withAuth0: true },
);
