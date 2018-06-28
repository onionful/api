import { kebabCase, mapValues } from 'lodash';
import { Content } from './models';
import { errors, wrapper, verify } from './utils';

const parse = content => ({ tags: [], ...content });

const create = ({ headers: { Space: space }, body: { title, ...rest } }) =>
  Content.create({ ...rest, title, slug: kebabCase(title), space }).then(parse);

const update = ({ headers: { Space: space }, body, pathParameters: { slug } }) =>
  Content.update({ space, slug }, body, { condition: 'attribute_exists(slug)' })
    .catch(({ message }) => {
      throw new errors.NotFound(message);
    })
    .then(parse);

const get = ({ headers: { Space: space }, pathParameters: { slug } }) =>
  Content.get({ space, slug })
    .then(verify.presence)
    .then(parse);

const list = () =>
  Content.scan()
    .exec()
    .then(items => items.map(parse));

module.exports = mapValues({ create, update, get, list }, wrapper);
