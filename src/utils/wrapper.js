import middy from 'middy';
import secrets from 'middy-secrets';
import { cors, httpErrorHandler, jsonBodyParser, urlEncodeBodyParser } from 'middy/middlewares';

export default (fn, { secretName, raw = false } = {}) => {
  const handler = middy((...args) =>
    Promise.resolve(fn(...args)).then(data => (raw ? data : { body: data }))
  )
    .use(cors())
    .use(jsonBodyParser())
    .use(urlEncodeBodyParser())
    .use(httpErrorHandler());

  if (secretName) {
    handler.use(secrets({
      secretName,
      setToContext: true,
      contextKey: 'config',
    }));
  }

  return handler;
}
