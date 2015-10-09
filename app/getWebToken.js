// for web apps
function getWebToken(req, res){
  
  var originsWhiteList = config.API_CONFIG.domainWhiteList,
      requestOrigin = req.headers.origin,
      clientId = req.body.client_id,
      clientSecret = req.body.client_secret,
      isValidRequest = require('./services').isValidRequest,
      setResponseHeader = require('./services').setResponseHeader;


  originsWhiteList = originsWhiteList || '*';
  setResponseHeader(res);
  
  if(requestOrigin){
    if(originsWhiteList !== '*' && originsWhiteList.indexOf(requestOrigin) === -1){
      res.status(403);
      res.send(config.RESPONSE_MESSAGE.INVALID_ORIGIN);
      logger.info(config.LOG_MESSAGES.INVALID_ORIGIN_TOKEN_REQUEST);
      return;
    }else{
      if(isValidRequest(clientId, clientSecret)){
        res.header('Access-Control-Allow-Origin', requestOrigin); 
       
        profile = {
          client_id: config.VALID_CLIENT_IDS[1],
          currentTime: new Date().getTime()
        };

        // we are sending the profile in the token
        token = jwt.sign(profile, config.JWT_SECRET_WEB_APP);
        res.status(200);
        res.json({access_token: token});
      }
      else{
        logger.info(config.LOG_MESSAGES.INVALID_WEB_USER_TOKEN_REQUEST);
        res.json({invalid_param: config.LOG_MESSAGES.INVALID_WEB_USER_TOKEN_REQUEST});
        res.status(401);
        return;
      }
    }
  }
  else{
    // add code here if html pages are hosted on the same server as oAuth server
  }

}

module.exports = getWebToken;