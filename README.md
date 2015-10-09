/*
	Author: Navdeep Jain
	Title : Sample oAuth2.0 server with Client Credential implementation
	Description : 
				Purpose of this implementation is to secure service api (web services) and socket api (web socket connection) from any random unauthorized client for the apps that don't have user login. 
				The use case here is we have two different resource servers: 1) A nodejs server that hosts diffferent web services to be consumed in a hybrid (iOS app created using phonegap app) and web app 2) A nodejs server that works as web socket server and its client would be a hybrid (iOS app created using phonegap app) and web app. And we need to restrict their access to authorised clients (Our own hybrid and web apps). 

	Prerequisite : Understanding of oAuth2.0, nodejs, socket.io, JSON Web Token(JWT)
*/


This package itself is an authoisation server with only Client Credential method implementation. 

Get Token:
========================================================================================
It issues token to authorised users.

1) Hybrid app: (app/getHybridToken.js)

url : http://localhost:3000/getToken/hybrid
body : client_id, client_secret

Before issuing token it verifies for valid hybrid app, client_id, client_secret

2) Web app: (app/getWebToken.js)

url : http://localhost:3000/getToken/web
body : client_id, client_secret

Before issuing token it verifies for valid origin of request, client_id, client_secret

Any client that need to access any of the resource servers first of all must get access_token


Middleware:
========================================================================================

1) ServiceAPI Middleware : (lib/serviceAPIMW.js)

This is an expressjs middleware. Include this middleware in your service api server, so that only valid request can access the apis. For hybrid apps it validates a valid hybrid app and access_token.

2) SocketAPI Middleware : (lib/socketAPIMW.js)

This is a socketio middleware. Include this middleware in your socket api server, so that only valid request can make socket connection. For hybrid apps it validates a valid request origin and access_token.


Other Features:
========================================================================================

1) Standard boilerplate for a nodejs server
2) Unified logging 
3) Cron job to remove log file content everyday


Note:
=========================================================================================

1) Only one config file is used. Node config module can be used for separate config file for development and production environment.
2) Client_secret and JWT secret should be stored in persistent database such as mongodb to make and should be accessible to resource (service api and socket api) servers.
3) For hybrid apps, token request should come from native code and include device_uuis as additional parameter to make it more secure.
4) For hybrid apps, socket connection should be restricted one per device per app.
