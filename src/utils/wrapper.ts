import 'module-alias/register';
import middy from '@middy/core';
import httpCors from '@middy/http-cors';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpUrlEncodeBodyParser from '@middy/http-urlencode-body-parser';
import secretsManager from '@middy/secrets-manager';
import { ManagementClient } from 'auth0';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context as BaseContext } from 'aws-lambda';
import errors from 'http-errors';
import { permissions } from 'utils';

process.on('unhandledRejection', console.error); // print stacktrace for unhandled promises rejection

const { ENVIRONMENT, IS_OFFLINE, OFFLINE_CACHE_CONTROL = 0 } = process.env;

interface WrapperOptions {
  checkPermission: boolean;
  rawResponse: boolean;
  withAuth0: boolean;
  withConfig: boolean;
}

interface Context extends BaseContext {
  Auth0: ManagementClient;
  config: {
    auth0: {
      jwksUri: string;
      audience: string;
      domain: string;
      api: {
        clientId: string;
        clientSecret: string;
      };
    };
  };
}

interface User {
  id: string;
  roles: string[];
  permissions: string[];
  groups: string[];
}

const transformResponse = (raw: boolean) => <T>(data: T): T | APIGatewayProxyResult =>
  raw ? data : { statusCode: 200, body: JSON.stringify(data) };

const wrapper = <
  Params extends {},
  Response extends {},
  Body extends {} = {},
  Event = Omit<APIGatewayProxyEvent, 'queryStringParameters' | 'body'> & {
    queryStringParameters: Params;
    body: Body;
    user: User;
  }
>(
  fn: (event: Event, context: Context) => Response | Promise<Response>,
  {
    checkPermission = null,
    rawResponse = false,
    withAuth0 = false,
    withConfig = false,
  }: Partial<WrapperOptions> = {},
) => {
  console.log('rawResponse', rawResponse);
  const handler = middy((event: Event, context: Context) =>
    Promise.resolve(transformResponse(rawResponse)(fn(event, context))),
  );
  // const handler = middy((...args) =>
  //   Promise.resolve(fn(...args)).then(transformResponse(rawResponse)),
  // )
  handler
    .use(httpCors())
    .use(httpEventNormalizer())
    .use(httpHeaderNormalizer())
    .use(httpJsonBodyParser())
    .use(httpUrlEncodeBodyParser());

  handler.before(({ event }, next) => {
    // @ts-ignore
    const { requestContext: { authorizer = {} } = {} } = event;
    ['permissions', 'groups', 'roles'].forEach(key => {
      // @ts-ignore
      authorizer[key] = (authorizer[key] || '').split(',').filter(v => v);
    });
    // @ts-ignore
    event.user = { ...authorizer, id: authorizer.sub };
    next();
  });

  // const secrets = {};
  // if (withConfig || withAuth0) {
  //   Object.assign(secrets, { config: `${ENVIRONMENT}/onionful` });
  // }
  // if (withAuth0) {
  //   Object.assign(secrets, { Auth0Token: `${ENVIRONMENT}/onionful/token` });
  // }
  // handler.use(secretsManager({ cache: true, secrets }));
  //
  // if (withAuth0) {
  //   handler.before((h, next) => {
  //     // @ts-ignore
  //     const { config: { auth0: { domain } = {} } = {}, Auth0Token: { token } = {} } = h.context;
  //     const Auth0 = token && domain ? new ManagementClient({ token, domain }) : null;
  //     Object.assign(h.context, { Auth0 });
  //
  //     if (!Auth0) {
  //       throw new errors.Unauthorized('Auth0 client cannot be initialized');
  //     }
  //
  //     next();
  //   });
  // }
  //
  // if (checkPermission) {
  //   // @ts-ignore
  //   handler.before(({ event: { user } }, next) => {
  //     // @ts-ignore
  //     if (permissions.can(user, checkPermission)) {
  //       return next();
  //     }
  //     throw new errors.Unauthorized(`User has no permission to invoke: ${checkPermission}`);
  //   });
  // }
  //
  // // handler.onError((h, next) => {
  // //   // @ts-ignore
  // //   const { statusCode: status, code: codeName, name, message } = h.error;
  // //   const code = codeName || name;
  // //   const statusCode = status || (code === 'ValidationError' && 400) || 500;
  // //   const body = { statusCode, code, message };
  // //
  // //   console.error(body);
  // //   // @ts-ignore
  // //   h.response = Object.assign(h.response || {}, {
  // //     statusCode,
  // //     body: JSON.stringify(body),
  // //   });
  // //
  // //   next();
  // // });
  // //
  // // handler.after((h, next) => {
  // //   if (IS_OFFLINE) {
  // //     // @ts-ignore
  // //     h.response.headers = h.response.headers || {};
  // //     // @ts-ignore
  // //     h.response.headers['Cache-Control'] = `max-age=${OFFLINE_CACHE_CONTROL}`;
  // //   }
  // //
  // //   next();
  // // });

  return handler;
};

export default wrapper;
