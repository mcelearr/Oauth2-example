require('env2')('config.env');
const Hapi = require('hapi');
const Inert = require('inert');

const server = new Hapi.Server();
const port = process.env.PORT;
server.connection({ port: port });

server.register(Inert, err => {
  if (err) throw err;

  server.route({
    method: 'GET',
    path: '/{params*}',
    handler: {
      directory: {
        path: './public',
        index: true,
      },
    },
  });
});

server.start((starterr) => {
  if (starterr) {
    console.log(starterr);
  }
  console.log('Server running at:', server.info.uri);
});
