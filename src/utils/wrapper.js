import { ManagementClient } from 'auth0';
import errors from 'http-errors';
import jwt from 'jsonwebtoken';
import { mapKeys } from 'lodash';
import middy from 'middy';
import {
  cors,
  httpEventNormalizer,
  httpHeaderNormalizer,
  jsonBodyParser,
  secretsManager,
  urlEncodeBodyParser,
} from 'middy/middlewares';

process.on('unhandledRejection', console.error); // print stacktrace for unhandled promises rejection

const { STAGE, IS_OFFLINE, OFFLINE_CACHE_CONTROL = 0 } = process.env;
const transformResponse = raw => data => (raw ? data : { body: JSON.stringify(data) });

export default (
  fn,
  {
    checkPermission = null,
    rawResponse = false,
    withConfig = false,
    withAuth0 = false,
    withUser = false,
  } = {},
) => {
  const handler = middy((...args) =>
    Promise.resolve(fn(...args)).then(transformResponse(rawResponse)),
  )
    .use(cors())
    .use(httpEventNormalizer())
    .use(httpHeaderNormalizer())
    .use(jsonBodyParser())
    .use(urlEncodeBodyParser());

  const secrets = {};
  if (withConfig || withAuth0) {
    Object.assign(secrets, { config: `${STAGE}/onionful` });
  }
  if (withAuth0) {
    Object.assign(secrets, { Auth0Token: `${STAGE}/onionful/token` });
  }
  handler.use(secretsManager({ cache: true, secrets }));

  if (withAuth0) {
    handler.before((h, next) => {
      const { config: { auth0: { domain } = {} } = {}, Auth0Token: { token } = {} } = h.context;
      const Auth0 = token && domain ? new ManagementClient({ token, domain }) : null;
      Object.assign(h.context, { Auth0 });

      if (!Auth0) {
        throw new errors.Unauthorized('Auth0 client cannot be initialized');
      }

      next();
    });
  }

  if (withUser || checkPermission) {
    handler.before(({ context, event: { headers: { Authorization = '' } = {} } }, next) => {
      const [, token] = Authorization.split(' ');
      const domain = 'https://onionful.com/';
      context.User = mapKeys(jwt.decode(token), (value, key) => key.replace(domain, ''));

      if (
        checkPermission &&
        context.User.permissions &&
        !~context.User.permissions.indexOf(checkPermission)
      ) {
        throw new errors.Unauthorized(`User has no permission to invoke: ${checkPermission}`);
      }
      next();
    });
  }

  handler.onError((h, next) => {
    const { statusCode: status, code: codeName, name, message } = h.error;
    const code = codeName || name;
    const statusCode = status || (code === 'ValidationError' && 400) || 500;
    const body = { statusCode, code, message };

    console.error(body);
    h.response = Object.assign(h.response || {}, {
      statusCode,
      body: JSON.stringify(body),
    });

    next();
  });

  handler.after((h, next) => {
    if (IS_OFFLINE) {
      h.response.headers = h.response.headers || {};
      h.response.headers['Cache-Control'] = `max-age=${OFFLINE_CACHE_CONTROL}`;
    }

    next();
  });

  return handler;
};
