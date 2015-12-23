var Express = require('express');

var server = Express();
server.use('/', Express.static('./build'));
server.listen(process.env.PORT || 8080);
