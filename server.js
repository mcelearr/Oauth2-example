require('env2')('config.env');
const Hapi = require('hapi');
const Inert = require('inert');
const querystring = require('querystring');
const httpsRequest = require('./https-request.js');

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
  },
  { method: 'GET',
    path: '/welcome',
    handler: (request, reply) => {
      const authToken = request.query.code;
      const payload = querystring.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: authToken,
      });
      const optionsObject = {
        headers: {
          'Accept'         : 'application/json',
          'Content-Type'   : 'application/x-www-form-urlencoded',
          'Content-Length' : payload.length,
        },
        body: payload,
        hostname: 'github.com',
        port: 443,
        path: '/login/oauth/access_token',
        method: 'POST',
      };

      httpsRequest(optionsObject, (err, response) => {
        console.log(err || response);
        reply(err || response);
      })
    }
  }]);
});

server.start((starterr) => {
  if (starterr) {
    console.log(starterr);
  }
  console.log('Server running at:', server.info.uri);
});
