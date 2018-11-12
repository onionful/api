const functions = require('./serverless.functions');
const iamRoleStatements = require('./serverless.iamRoleStatements');

const {
  AWS_KMS_KEY_ARN,
  FUNCTION,
  DOMAIN,
  ENVIRONMENT = 'development',
  OFFLINE_HOST,
  OFFLINE_PORT,
  SERVICE,
} = process.env;

const service = [SERVICE, FUNCTION].join('-');

module.exports = {
  service: {
    name: service,
    awsKmsKeyArn: AWS_KMS_KEY_ARN,
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs8.10',
    region: 'eu-west-1',
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
