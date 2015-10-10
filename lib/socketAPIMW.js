// module dependency when hosted on resource sever: jsonwebtoken, config, iswebview

function isAuthorisedSocketRequest(socket, next){
  var req = socket.request,
      url = req.url,
      access_token, userAgent, originId, origin;
      // add below while using inside resource server
      // jwt = require('jsonwebtoken'); 
      // config = require('./../config'),
      // iswebview = require('is-webview'),;

  if(url.indexOf('access_token') > -1){
    access_token = url.substring(url.indexOf('=')+1, url.indexOf('&'));
    if(!access_token){
      socket.disconnect();
      logger.info(config.LOG_MESSAGES.SOCKET_CONN_REQ_WITHOUT_TOKEN);
      return; 
    }      
  }
  else{
    logger.info(config.LOG_MESSAGES.SOCKET_CONN_REQ_WITHOUT_TOKEN);
    socket.disconnect();
    return; 
  }
  userAgent = req.rawHeaders[req.rawHeaders.indexOf('User-Agent')+1];

  //To do: 
  // Add deviceID, access_token and socket details in Redis cache
  if(iswebview(userAgent)){
    jwt.verify(access_token, config.JWT_SECRET_MOBILE_APP, function(err, decoded){
      if (err || !decoded){ 
        logger.error(config.LOG_MESSAGES.SOCKET_CONN_HYBRID_TOKEN_RETRIVAL_ERROR);
        socket.disconnect();
        return; 
      }
      
      // add deviceId 
      if(decoded.client_id && decoded.currentTime && config.VALID_CLIENT_IDS.indexOf(decoded.client_id) > -1){
        next();
      }
    })
  }
  else{
    // Write Condition for website
    originId = req.rawHeaders.indexOf("origin");
    origin = originId > -1 ? req.rawHeaders[req.rawHeaders.indexOf('origin')+1] : 0;
    if(origin){
      if(config.API_CONFIG.domainWhiteList.indexOf(origin) > -1){
        jwt.verify(access_token, config.JWT_SECRET_WEB_APP, function(err, decoded){
          if (err || !decoded){
            res.json({
              msg : config.RESPONSE_MESSAGE.SERVER_ERROR
            })
            res.status(500);
            logger.error(config.LOG_MESSAGES.SOCKET_CONN_WEB_TOKEN_RETRIVAL_ERROR);
            return; 
          }
          if(decoded.client_id && decoded.currentTime && config.VALID_CLIENT_IDS.indexOf(decoded.client_id) > -1){
            next();
          }
        })
      }
      else{
        res.json({
          msg : config.RESPONSE_MESSAGE.INVALID_ORIGIN
        })
        res.status(401);
        return;
      }
    }
    else{
      next();
    }
  }
}

module.exports = isAuthorisedSocketRequest;

