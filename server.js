var express = require('express')
  app = express(),
  bodyParser = require('body-parser'),
  winston = require('winston'),
  http = require('http'),
  config = require('./config'),
  logger = {},
  https = require('https'),
  fs = require('fs'),
  bodyParser = require('body-parser'),
  socket = require('socket.io'),
  isAuthorisedServiceRequest = require('./lib/serviceAPIMW'),
  isAuthorisedSocketRequest = require('./lib/socketAPIMW'),
  oAuthRouter = require("./router"),
  tokenRouter = express.Router(),
  iswebview = require('is-webview'),
  jwt = require('jsonwebtoken'),
  cronJob = require('cron').CronJob;

// initialize logger
logger = new winston.Logger({
  transports: [
          new (winston.transports.File)({
            name: 'info-file',
            filename: config.INFOLOGFILE,
            level: 'info'
          }),
          new (winston.transports.File)({
            name: 'error-file',
            filename: config.ERRORLOGFILE,
            level: 'error'
          })
      ],
  }) || console ;  

// Cron job to empty logger file every 24 hours
new cronJob(
    config.CRON_TIME, 
    emptyLogFile,
    null, 
    true, 
    config.CRON_TIMEZONE);

function emptyLogFile(){
  fs.writeFileSync(config.INFOLOGFILE,'');
  fs.writeFileSync(config.ERRORLOGFILE,'');
}


/**
 * Create server.
 */

var server, port;

if(config.isSSL){
  var privateKey  = fs.readFileSync('./config/ssl/key.pem', 'utf8'),
      certificate = fs.readFileSync('./config/ssl/cert.pem', 'utf8');
 
  if(!privateKey || !certificate) {
    logger.error("Invalid SSL config");
    return;
  }

  credentials = {key: privateKey, cert: certificate},
  port = normalizePort(process.env.PORT || 443);
  app.set('port', port);
  server = https.createServer(credentials, app);
    console.log("server started on https://localhost:"+port);

}
else{
  port = normalizePort(process.env.PORT || 3000);
  app.set('port', port);
  server = http.createServer(app);
  console.log("server started on http://localhost:"+port);

}


io = socket.listen(server);
  

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

// error handler
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
 
  // handle CSRF token errors here
  res.status(403)
  res.send('session has expired or form tampered with')
})


app.use('/getToken', tokenRouter);
oAuthRouter.defineTokenRoutes(tokenRouter);
// ========================= Service API middlware, for detail check lib/serviceAPIMW.js ===========================

app.use(isAuthorisedServiceRequest);

app.all('/callServiceAPI', function(req, res){
  res.json({
    msg : "Jai ho"
  })
  res.status(200);
});

// ========================= Service API code ends her ======================

// =========================Socket API middlware, for detail check lib/socketAPIMW.js =========================
io.use(isAuthorisedSocketRequest);

io.on('connection', function(socket) {
  socket.emit("msg", "Jai ho");
});
// ===========================





/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
    logger.log('Listening on ' + bind);
}
