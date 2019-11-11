import { userFields, wrapper, validators } from 'utils';

export default wrapper(
  ({ pathParameters: { query: rawQuery } }, { Auth0 }) => {
    const query = decodeURIComponent(rawQuery);

    return validators.UserFind({ query }).then(() =>
      Auth0.getUsers({
        search_engine: 'v3',
        include_totals: true,
        per_page: 5,
        fields: userFields.join(),
        q: `name:*${query}* OR email:*${query}*`,
      }),
    );
  },
  { withAuth0: true },
);
