var oAuthApp = {},
	getHybridToken = require('./getHybridToken'),
	getWebToken = require('./getWebToken');

oAuthApp.getHybridToken = getHybridToken;
oAuthApp.getWebToken = getWebToken;

module.exports = oAuthApp;