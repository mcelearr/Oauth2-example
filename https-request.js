const https = require('https');

const request = (options, callback) => {
  const req = https.request(options, (res) => {
    let data = '';
    if (res.statusCode < 200 || res.statusCode > 399) {
      return callback(new Error('Non-200 Error'));
    };
    res.on('data', (d) => { data += d; });
    res.on('end', () => callback(null, data));
  });
  req.write(options.body ? JSON.stringify(options.body) : '');
  req.end();
  req.on('error', (err) => {
    callback(err);
  });
};

const optionsObject = {
  hostname: 'google.com',
  port: 443,
  path: '/',
  method: 'GET',
};

request(optionsObject, (err, data) => {
  console.log(data);
});
