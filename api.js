import pkg from './package';

exports.register = function (server, options, next) {
  const plugins = [];

  server.register(plugins, () => {
    server.route({
      method: 'GET',
      path: '/',
      handler: function(request, reply){ reply('OK'); }
    });
    return next();
  });
};

exports.register.attributes = { pkg };
