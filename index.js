import middy from 'middy';
import secrets from 'middy-secrets';
import {
  urlEncodeBodyParser,
  httpErrorHandler,
  jsonBodyParser,
  cors,
} from 'middy/middlewares';

const fn = (event) => {
  return Promise.resolve({ statusCode: 200, body: JSON.stringify(event) });
};

const handler = middy(fn)
  .use(secrets({
    region: 'eu-west-1',
    secretName: 'dev/onionful',
  }))
  .use(cors())
  .use(jsonBodyParser())
  .use(urlEncodeBodyParser())
  .use(httpErrorHandler())
;

module.exports = { handler };
