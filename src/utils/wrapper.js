import { ManagementClient } from 'auth0';
import errors from 'http-errors';
import jwt from 'jsonwebtoken';
import { mapKeys } from 'lodash';
import middy from 'middy';
import secrets from 'middy-secrets';
import {
  cors,
  httpEventNormalizer,
  httpHeaderNormalizer,
  jsonBodyParser,
  urlEncodeBodyParser,
} from 'middy/middlewares';

const { STAGE, IS_OFFLINE, OFFLINE_CACHE_CONTROL = 0 } = process.env;

export default (
  fn,
  {
    checkPermission = null,
    raw = false,
    withConfig = false,
    withAuth0 = false,
    withUser = false,
  } = {},
) => {
  const handler = middy((...args) =>
    Promise.resolve(fn(...args)).then(data => (raw ? data : { body: data })),
  )
    .use(cors())
    .use(httpEventNormalizer())
    .use(httpHeaderNormalizer())
    .use(jsonBodyParser())
    .use(urlEncodeBodyParser());

  if (withConfig || withAuth0) {
    handler.use(
      secrets({
        secretName: `${STAGE}/onionful`,
        setToContext: true,
        contextKey: 'config',
      }),
    );
  }

  if (withAuth0) {
    handler.use(
      secrets({
        secretName: `${STAGE}/onionful/token`,
        setToContext: true,
        contextKey: 'Auth0Token',
      }),
    );

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
      before: (
        {
          context,
          event: {
            headers: { Authorization },
          },
        },
        next,
      ) => {
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

  handler.use({
    onError: ({ error: { statusCode: status, code: codeName, name, message }, response }, next) => {
      const code = codeName || name;
      const statusCode = status || (code === 'ValidationError' && 400) || 500;

      Object.assign(response, {
        statusCode,
        body: JSON.stringify({ statusCode, code, message }),
      });

      next();
    },
    after: (h, next) => {
      h.response.headers = h.response.headers || {};

      if (IS_OFFLINE) {
        h.response.headers['Cache-Control'] = `max-age=${OFFLINE_CACHE_CONTROL}`;
      }

      next();
    },
  });

  return handler;
};
