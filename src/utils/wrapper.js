import errors from 'http-errors';
import middy from 'middy';
import jwt from 'jsonwebtoken';
import secrets from 'middy-secrets';
import { mapKeys } from 'lodash';
import { ManagementClient } from 'auth0';
import {
  cors,
  httpErrorHandler,
  httpEventNormalizer,
  jsonBodyParser,
  urlEncodeBodyParser,
} from 'middy/middlewares';

const { STAGE } = process.env;

export default (fn, {
  checkPermission = null,
  raw = false,
  withConfig = false,
  withAuth0 = false,
  withUser = false,
} = {}) => {
  const handler = middy((...args) =>
    Promise.resolve(fn(...args)).then(data => (raw ? data : { body: data })).catch(console.error)
  )
    .use(cors())
    .use(httpErrorHandler())
    .use(httpEventNormalizer())
    .use(jsonBodyParser())
    .use(urlEncodeBodyParser());

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

  if (withUser || checkPermission) {
    handler.use({
      before: ({ context, event: { headers: { Authorization } } }, next) => {
        const [, token] = Authorization.split(' ');
        const domain = 'https://onionful.com/';
        context.User = mapKeys(jwt.decode(token), (value, key) => key.replace(domain, ''));

        if (checkPermission && !~context.User.permissions.indexOf(checkPermission)) {
          throw new errors.Unauthorized(`User has no permission to invoke: ${checkPermission}`);
        }

        next();
      },
    });
  }

  return handler;
}