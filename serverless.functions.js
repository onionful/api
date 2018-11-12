const { has, mapKeys, mapValues, merge, update } = require('lodash');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const { AWS_ACCOUNT_ID, AWS_REGION, FUNCTION, IS_OFFLINE, SERVICE } = process.env;

const paths = {
  functions: path.join(__dirname, 'src', 'functions'),
};

const fix = (key, cb) => event => (has(event, key) ? update(event, key, cb) : event);

const fixPath = fn => fix('http.path', value => (IS_OFFLINE ? `${fn}${value}` : value));
const fixAuthorizer = fix('http.authorizer', value =>
  IS_OFFLINE
    ? [SERVICE, value].join('-')
    : {
        arn: `arn:aws:lambda:${AWS_REGION}:${AWS_ACCOUNT_ID}:function:${SERVICE}-${value}`,
        type: 'request',
        name: 'authorizer',
        identitySource: 'method.request.header.Authorizer',
        resultTtlInSeconds: 600,
      },
);

const loadFunctions = name => {
  const file = path.join(paths.functions, name, '.functions.yml');

  return fs.existsSync(file)
    ? mapKeys(
        mapValues(
          yaml.safeLoad(fs.readFileSync(file, 'utf8')),
          ({ handler, events = [], ...fn }, key) => ({
            ...fn,
            name: [SERVICE, name, key].join('-'),
            handler: path.join('src', 'functions', name, handler || `${key}.default`),
            events: events.map(fixAuthorizer).map(fixPath(name)),
          }),
        ),
        fn => fn.name,
      )
    : {};
};

module.exports = merge(
  {},
  ...(FUNCTION ? [FUNCTION] : fs.readdirSync(paths.functions)).map(loadFunctions),
);
