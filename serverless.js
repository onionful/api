const functions = require('./serverless.functions');
const iamRoleStatements = require('./serverless.iamRoleStatements');

const {
  AWS_REGION,
  FUNCTION,
  DOMAIN,
  ENVIRONMENT = 'development',
  OFFLINE_HOST,
  OFFLINE_PORT,
  SERVICE,
} = process.env;

const service = [SERVICE, FUNCTION].join('-');

module.exports = {
  service,
  provider: {
    name: 'aws',
    runtime: 'nodejs8.10',
    region: AWS_REGION,
    stage: ENVIRONMENT,
    environment: { ENVIRONMENT },
    iamRoleStatements,
    apiName: service,
    stackName: service,
  },
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-domain-manager',
    'serverless-aws-alias',
  ],
  custom: {
    'serverless-offline': {
      host: OFFLINE_HOST,
      port: OFFLINE_PORT,
    },
    customDomain: {
      basePath: FUNCTION,
      domainName: DOMAIN,
      stage: ENVIRONMENT,
    },
    webpack: {
      includeModules: true,
      packagerOptions: {
        scripts: ['rm -rf node_modules/aws-sdk'],
      },
    },
  },
  functions,
};
