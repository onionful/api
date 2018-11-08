import AWS from 'aws-sdk';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { errors, wrapper } from 'utils';

const generatePolicy = (principalId, Effect, Resource) => ({
  principalId,
  policyDocument:
    Effect && Resource
      ? {
          Version: '2012-10-17',
          Statement: [{ Action: 'execute-api:Invoke', Effect, Resource }],
        }
      : null,
});

export const check = wrapper(
  ({ authorizationToken, methodArn }, { config }) =>
    new Promise((resolve, reject) => {
      if (process.env.IS_OFFLINE) {
        return resolve(generatePolicy('offline', 'Allow', methodArn));
      }

      const [bearer, token] = (authorizationToken || '').split(' ');
      if (!(bearer.toLowerCase() === 'bearer' && token)) {
        console.error('Invalid token', { bearer, token });
        return reject(new errors.Unauthorized());
      }

      const {
        header: { kid },
      } = jwt.decode(token, { complete: true });

      return jwksClient({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: config.auth0.jwksUri,
      }).getSigningKey(kid, (err, { publicKey, rsaPublicKey } = {}) => {
        if (err) {
          console.error('JWKS error', err);
          return reject(new errors.Unauthorized());
        }

        try {
          return jwt.verify(
            token,
            publicKey || rsaPublicKey,
            {
              audience: config.auth0.clientId,
              issuer: `https://${config.auth0.domain}/`,
            },
            (verifyError, { sub } = {}) => {
              if (verifyError) {
                console.error('VerifyError', verifyError);
                reject(new errors.Unauthorized());
              } else {
                resolve(generatePolicy(sub, 'Allow', methodArn));
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

export const rotateToken = wrapper(
  (params, { config: { auth0 } }) =>
    axios
      .post(
        `https://${auth0.domain}/oauth/token`,
        {
          client_id: auth0.api.clientId,
          client_secret: auth0.api.clientSecret,
          audience: `https://${auth0.domain}/api/v2/`,
          grant_type: 'client_credentials',
        },
        { headers: { 'content-type': 'application/json' } },
      )
      .then(
        ({ data: { access_token: token } }) =>
          new Promise((resolve, reject) =>
            new AWS.SecretsManager().putSecretValue(
              {
                SecretId: `${process.env.STAGE}/onionful/token`,
                SecretString: JSON.stringify({ token }),
              },
              (error, data) => (error ? reject(error) : resolve(data)),
            ),
          ),
      ),
  { withConfig: true, rawResponse: true },
);
