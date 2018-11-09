const { has, mapKeys, mapValues, merge, update } = require('lodash');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const { AWS_ACCOUNT_ID, AWS_REGION, FUNCTION, IS_OFFLINE, SERVICE } = process.env;

const paths = {
  functions: path.join(__dirname, 'src', 'functions'),
};

const fixAuthorizer = event =>
  has(event, 'http.authorizer')
    ? update(
        event,
        'http.authorizer',
        value =>
          (IS_OFFLINE ? '' : `arn:aws:lambda:${AWS_REGION}:${AWS_ACCOUNT_ID}:function:`) +
          [SERVICE, value].join('-'),
      )
    : event;

const loadFunctions = name => {
  const file = path.join(paths.functions, name, '.functions.yml');

  return fs.existsSync(file)
    ? mapKeys(
        mapValues(
          yaml.safeLoad(fs.readFileSync(file, 'utf8')),
          ({ handler, events = [], ...fn }, key) => ({
            ...fn,
            name: [SERVICE, name, key].join('-'),
            handler: path.join('src', 'functions', name, handler),
            events: events.map(fixAuthorizer),
          }),
        ),
        fn => fn.name,
      )
    : {};
};

const xxx = FUNCTION ? [FUNCTION] : fs.readdirSync(paths.functions);
module.exports = merge({}, ...xxx.map(loadFunctions));
