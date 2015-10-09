// for hybrid apps
function getHybridToken (req, res){
  var clientId = req.body.client_id,
      clientSecret = req.body.client_secret,
      profile,
      token,
      isValidRequest = require('./services').isValidRequest,
      setResponseHeader = require('./services').setResponseHeader;

  // pending: use of ip address to track request
  // var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress,
     
  // add device Id param
  if(iswebview(req.headers['user-agent']) && isValidRequest(clientId, clientSecret)){

    setResponseHeader(res);
    res.header('Access-Control-Allow-Origin', '*'); 
    profile = {
      client_id: config.VALID_CLIENT_IDS[0],
      currentTime: new Date().getTime()
      // device_id: 'device_uuid',
    };

    // we are sending the profile in the token
    token = jwt.sign(profile, config.JWT_SECRET_MOBILE_APP);
    res.json({access_token: token});
    res.status(200);
  }
  else{
    logger.info(config.LOG_MESSAGES.INVALID_HYBRID_TOKEN_REQUEST);
    res.json({invalid_param: config.LOG_MESSAGES.INVALID_HYBRID_TOKEN_REQUEST});
    res.status(401);
    return;
  }

}

module.exports = getHybridToken;