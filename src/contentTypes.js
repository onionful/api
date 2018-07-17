import { kebabCase, mapValues } from 'lodash';
import { ContentType } from './models';
import { errors, wrapper, verify } from './utils';

const create = ({ headers: { Space: space }, body: { title, ...rest } }) =>
  ContentType.create({ ...rest, title, id: kebabCase(title), space });

const update = ({ headers: { Space: space }, body, pathParameters: { id } }) =>
  ContentType.update({ space, id }, body, { condition: 'attribute_exists(id)' }).catch(
    ({ message }) => {
      throw new errors.NotFound(message);
    },
  );

const get = ({ headers: { Space: space }, pathParameters: { id } }) =>
  ContentType.get({ space, id }).then(verify.presence);

const list = () =>
  ContentType.scan()
    .exec()
    .then(() => [
      {
        id: 'page',
        name: 'Page',
        description: 'Regular page type',
        fields: [],
      },
    ]);

module.exports = mapValues({ create, update, get, list }, wrapper);
