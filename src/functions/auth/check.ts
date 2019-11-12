import { CustomAuthorizerEvent } from 'aws-lambda';
import jwt, { JwtHeader } from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { isArray, mapKeys, mapValues } from 'lodash';
import { errors, wrapper } from 'utils';

const { IS_OFFLINE } = process.env;

type TokenPayload = {
  nonce: string;
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
} & { [key: string]: string };

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
      if (IS_OFFLINE) {
        return resolve(generatePolicy('offline', 'Allow', methodArn));
      }

      const [bearer, token] = (authorizationToken || '').split(' ');
      if (!(bearer.toLowerCase() === 'bearer' && token)) {
        console.error('Invalid token', { bearer, token });
        return reject(new errors.Unauthorized());
      }

      const {
        header: { kid },
      } = jwt.decode(token, { complete: true }) as {
        header: JwtHeader;
      };

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
            (verifyError, response: TokenPayload) => {
              if (verifyError) {
                console.error('VerifyError', verifyError);
                reject(new errors.Unauthorized());
              } else {
                const context = mapValues(
                  mapKeys(response, (value, key) => key.replace('https://onionful.com/', '')),
                  value => (isArray(value) ? value.join() : value),
                );

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
