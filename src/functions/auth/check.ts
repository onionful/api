import { CustomAuthorizerEvent } from 'aws-lambda';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { isArray, mapKeys, mapValues } from 'lodash';
import { errors, wrapper } from 'utils';

const { IS_OFFLINE } = process.env;

const generatePolicy = (principalId: string, Effect: string, Resource: string, context = {}) => ({
  context,
  principalId,
  policyDocument:
    Effect && Resource
      ? {
          Version: '2012-10-17',
          Statement: [{ Action: 'execute-api:Invoke', Effect, Resource }],
        }
      : null,
});

exports.default = wrapper<{}, {}, {}, CustomAuthorizerEvent>(
  ({ authorizationToken, methodArn }, { config: { auth0 } }) =>
    new Promise((resolve, reject) => {
      console.log('XXXXXXXXXXX');
      if (IS_OFFLINE) {
        return resolve(generatePolicy('offline', 'Allow', methodArn));
      }

      const [bearer, token] = (authorizationToken || '').split(' ');
      if (!(bearer.toLowerCase() === 'bearer' && token)) {
        console.error('Invalid token', { bearer, token });
        return reject(new errors.Unauthorized());
      }

      // @ts-ignore
      const { header: { kid } = {} } = jwt.decode(token, { complete: true }) || {};

      return jwksClient({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: auth0.jwksUri,
      }).getSigningKey(kid, (err, key) => {
        if (err) {
          console.error('JWKS error', err);
          return reject(new errors.Unauthorized());
        }

        // TODO: workaround because of https://github.com/auth0/node-jwks-rsa/issues/103
        const signingKey =
          (key as jwksClient.CertSigningKey).publicKey ||
          (key as jwksClient.RsaSigningKey).rsaPublicKey;

        try {
          return jwt.verify(
            token,
            signingKey,
            {
              audience: auth0.audience,
              issuer: `https://${auth0.domain}/`,
            },
            (verifyError, response) => {
              if (verifyError) {
                console.error('VerifyError', verifyError);
                reject(new errors.Unauthorized());
              } else {
                console.log('response', response);
                const context = mapValues(
                  // @ts-ignore
                  mapKeys(response, (value, key) => key.replace('https://onionful.com/', '')),
                  value => (isArray(value) ? value.join() : value),
                );

                // @ts-ignore
                resolve(generatePolicy(response.sub, 'Allow', methodArn, context));
              }
            },
          );
        } catch (e) {
          console.error('JWT error', e);
          return reject(new errors.Unauthorized());
        }
      });
    }),
  { withConfig: true, rawResponse: true },
);
