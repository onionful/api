import { ManagementClient } from 'auth0';
import middy from 'middy';
import secrets from 'middy-secrets';
import { cors, httpErrorHandler, jsonBodyParser, urlEncodeBodyParser } from 'middy/middlewares';

const { STAGE } = process.env;

export default (fn, { raw = false, withConfig = false, withAuth0 = false } = {}) => {
  const handler = middy((...args) =>
    Promise.resolve(fn(...args)).then(data => (raw ? data : { body: data })).catch(console.error)
  )
    .use(cors())
    .use(jsonBodyParser())
    .use(urlEncodeBodyParser())
    .use(httpErrorHandler());

  if (withConfig || withAuth0) {
    handler.use(secrets({
      secretName: `${STAGE}/onionful`,
      setToContext: true,
      contextKey: 'config',
    }));
  }

  if (withAuth0) {
    handler.use(secrets({
      secretName: `${STAGE}/onionful/token`,
      setToContext: true,
      contextKey: 'Auth0Token',
    }));

    handler.use({
      before: ({ context }, next) => {
        const { config: { auth0: { domain } = {} } = {}, Auth0Token: { token } = {} } = context;
        context.Auth0 = token && domain ? new ManagementClient({ token, domain }) : null;
        next();
      },
    });
  }

  return handler;
}
