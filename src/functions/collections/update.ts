import { CollectionModel } from 'models';
import { Collection } from 'types';
import { wrapper } from 'utils';
import { parse } from './.helpers';

interface Params {
  id: string;
}

export default wrapper<Params, Collection, Collection>(
  ({ headers: { Space: space }, body, pathParameters: { id } }) =>
    CollectionModel.updateWithId({ space, id }, { id }, previousBody => {
      const fields = (body.fields || previousBody.fields).map((field, order) => ({
        ...field,
        order,
      }));
      return { ...body, fields };
    }).then(parse),
);
