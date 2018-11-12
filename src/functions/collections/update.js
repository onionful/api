import { Collection } from 'models';
import { wrapper } from 'utils';
import { parse } from './.helpers';

export default wrapper(({ headers: { Space: space }, body, pathParameters: { id } }) =>
  Collection.updateWithId({ space, id }, { id }, previousBody => {
    const fields = (body.fields || previousBody.fields).map((field, order) => ({
      ...field,
      order,
    }));
    return { ...body, fields };
  }).then(parse),
);
