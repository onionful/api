/* eslint-disable */
import uuid from 'uuid/v4';
import { kebabCase } from 'lodash';
import { wrapper } from './utils';
import { Space } from './models';

const create = ({ body: { name, createdBy } }) =>
  Space.create({
    id: kebabCase(name),
    name,
    createdBy,
  });

const update = ({ body, pathParameters: { id } }) => {
  //const timestamp = new Date().getTime();
  //const Item = { ...body, id: uuid.v1(), createdAt: timestamp, updatedAt: timestamp };
  //return db.put({
  //  TableName,
  //  Key: { id },
  //  UpdateExpression: `set `,
  //  Item,
  //}).promise().then(() => Item);
};

const get = ({ pathParameters: { id } }) =>
  db
    .get({
      TableName,
      Key: { id },
    })
    .promise()
    .then(({ Item }) => Item);

const list = () =>
  db
    .scan({
      TableName,
    })
    .promise()
    .then(({ Items }) => Items);

module.exports = {
  create: wrapper(create),
  update: wrapper(update),
  get: wrapper(get),
  list: wrapper(list),
};
