import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { errors, wrapper } from 'utils';

const { IS_OFFLINE } = process.env;

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

export default wrapper(
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
      } = jwt.decode(token, { complete: true });

      return jwksClient({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: auth0.jwksUri,
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
              audience: auth0.clientId,
              issuer: `https://${auth0.domain}/`,
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
