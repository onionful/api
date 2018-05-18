import uuid from 'uuid';
import { wrapper } from './utils';

const TableName = process.env.DYNAMODB_TABLE || 'Onionful.Spaces';

const create = ({ body }) => {
  console.log('body', body);
  return 'x';
  //const timestamp = new Date().getTime();
  //const Item = { ...body, id: uuid.v1(), createdAt: timestamp, updatedAt: timestamp };
  //return db.put({ TableName, Item }).promise().then(() => Item);
};

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

const get = ({ pathParameters: { id } }) => db.get({
  TableName,
  Key: { id },
}).promise().then(({ Item }) => Item);

const list = () => db.scan({
  TableName,
}).promise().then(({ Items }) => Items);

module.exports = {
  create: wrapper(create),
  update: wrapper(update),
  get: wrapper(get),
  list: wrapper(list),
};
