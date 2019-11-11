import { kebabCase } from 'lodash';
import { CollectionModel } from 'models';
import { Collection } from 'types';
import { verify, wrapper } from 'utils';
import { parse } from './.helpers';

export default wrapper<{}, Collection, Collection>(({ headers: { Space: space }, body }) => {
  const id = kebabCase(body.id || body.name);

  return CollectionModel.get({ space, id })
    .then(verify.conflict)
    .then(() => CollectionModel.create({ ...body, id, space }).then(parse));
});
