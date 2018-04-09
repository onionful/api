import middy from 'middy';
import { urlEncodeBodyParser, httpErrorHandler, jsonBodyParser, cors } from 'middy/middlewares';

const processPayment = (event) => {
  return Promise.resolve({ statusCode: 200, body: JSON.stringify(event) });
};

const handler = middy(processPayment)
  .use(cors())
  .use(jsonBodyParser())
  .use(urlEncodeBodyParser())
  .use(httpErrorHandler())
;

module.exports = { handler };
