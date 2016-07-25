require('env2')('config.env');
const Hapi = require('hapi');
const Inert = require('inert');
const querystring = require('querystring');

const server = new Hapi.Server();
const port = process.env.PORT;
server.connection({ port: port });

server.register(Inert, err => {
  if (err) throw err;

  server.route([{
    method: 'GET',
    path: '/{params*}',
    handler: {
      directory: {
        path: './public',
        index: true,
      },
    },
  },
  { method: 'GET',
    path: '/login',
    handler: (request, reply) => {
      const loginQueryString = querystring.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        redirect_uri: process.env.REDIRECT_URI,
      });
      reply.redirect('https://github.com/login/oauth/authorize?' + loginQueryString);
    },
  }]);
});

server.start((starterr) => {
  if (starterr) {
    console.log(starterr);
  }
  console.log('Server running at:', server.info.uri);
});
