var oAuthRouter,
	app;

app = require("../app");

function defineTokenRoutes(router){
	router.all('/hybrid', app.getHybridToken);
	router.all('/web', app.getWebToken);
}

oAuthRouter ={};
oAuthRouter.defineTokenRoutes = defineTokenRoutes;

module.exports = oAuthRouter;