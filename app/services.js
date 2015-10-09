var services = {};

// grant_type parameter is ommitted as only client credentail method is implemented 

function isValidRequest(clientId, clientSecret){
  
  var config = require("./../config");
  	  clientIds =  config.VALID_CLIENT_IDS;
      secret = config.VALID_CLIENT_SECRETS[clientId];
  return clientId && clientSecret && (clientIds.indexOf(clientId) > -1) && (secret === clientSecret);

}

function setResponseHeader(res){
	res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
}

services.isValidRequest = isValidRequest;
services.setResponseHeader = setResponseHeader;

module.exports = services;