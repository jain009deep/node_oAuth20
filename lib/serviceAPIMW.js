// module dependency when hosted on resource sever: jsonwebtoken, config, iswebview

function isAuthorisedServiceRequest(req, res, next){
  var access_token = extractToken(req);
   // add below while using inside resource server
      // jwt = require('jsonwebtoken'),
      // config = require('./../config');
      // iswebview = require('is-webview'),

  if(!access_token){
    res.json({
        msg : config.RESPONSE_MESSAGE.UNAUTHORISED_USER
      })
    res.status(401);
    logger.info(config.LOG_MESSAGES.SERVICE_API_REQ_WITHOUT_TOKEN);
    return;
  }
  // condition for hybrid app
  if(iswebview(req.headers['user-agent'])){
    jwt.verify(access_token, config.JWT_SECRET_MOBILE_APP, function(err, decoded){
      if (err || !decoded){
        res.json({
          msg : config.RESPONSE_MESSAGE.SERVER_ERROR
        })
        res.status(500);
        logger.error(config.LOG_MESSAGES.SERVICE_API_HYBRID_TOKEN_RETRIVAL_ERROR);
        return  
      }
      // add deviceId 
      if(decoded.client_id && decoded.currentTime && config.VALID_CLIENT_IDS.indexOf(decoded.client_id) > -1){

        next();
      }
    })
  }
  // condition for web app
  else{
    if(req.headers.origin){
      if(config.API_CONFIG.domainWhiteList.indexOf(req.headers.origin) > -1){
        jwt.verify(access_token, config.JWT_SECRET_WEB_APP, function(err, decoded){
          if (err || !decoded){
            res.json({
              msg : config.RESPONSE_MESSAGE.SERVER_ERROR
            })
            res.status(500);
            logger.error(config.LOG_MESSAGES.SERVICE_API_WEB_TOKEN_RETRIVAL_ERROR);
            return  
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
        logger.info(config.LOG_MESSAGES.INVALID_ORIGIN_SERVICE_ACCESS);
        return;
      }
    }
    else{
      next();
    }
  }
}

function extractToken(req){
  if(req.headers.access_token){
    return req.headers.access_token;
  }
  else if (req.query && req.query.access_token) {
    return req.query.access_token;
  }
  else if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
  }
  return null;
}

module.exports = isAuthorisedServiceRequest;