import { Content } from 'models';
import { errors, wrapper } from 'utils';
import { parse } from './.helpers';

export default wrapper(({ headers: { Space: space }, body, pathParameters: { id } }) =>
  Content.update({ space, id }, body, { condition: 'attribute_exists(id)' })
    .then(parse)
    .catch(({ message }) => {
      throw new errors.NotFound(message);
    }),
);
