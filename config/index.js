/*
    config file: declare constants and messages here
    // To do:
        Move JWT_SECRET_MOBILE_APP, JWT_SECRET_WEB_APP, VALID_CLIENT_IDS, VALID_CLIENT_SECRETS to mongodb so that it can be accessed through service_api and socket_api server
*/
var config = {
    "isSSL": false,
    "isCSRF": false,
    "CRON_TIMEZONE" : "America/New_York",
    "CRON_TIME" : "23 59 59 * * 0-6",
    "ServerWhiteList": [
            "http://localhost",
            "https://localhost"
        ],
    "CRON_TIMEZONE" : "America/New_York",
    "INFOLOGFILE" : "oauthserver-info.log",
    "ERRORLOGFILE" : "oauthserver-error.log",
    "JWT_SECRET_MOBILE_APP" : "769A19B0-66E6-11E5-A837-0800200C9A66",
    "JWT_SECRET_WEB_APP" : "88262962-BD2F-47A4-906C-B9E5FAD0ADA1", 
    "VALID_CLIENT_IDS" : [
            "mobileApp",
            "webApp"
        ],
    "VALID_CLIENT_SECRETS" : {
            "mobileApp" : "20cb2d21-5e3d-4f7b-ba3a-a681a8814359", 
            "webApp" : "a730113a-66e9-11e5-9d70-feff819cdc9f"
        },
    "API_CONFIG" : {
        "domainWhiteList" : [
            "http://localhost",
            "https://localhost",
            "chrome-extension://hgmloofddffdnphfgcellkdfbfbjeloo"
        ]
    },
    "RESPONSE_MESSAGE" : {
        "INVALID_ORIGIN" : "Invalid origin",
        "UNAUTHORISED_USER" : "Unauthorised user",
        "SERVER_ERROR" : "Internal server error"
    },
    "LOG_MESSAGES":{
        "INVALID_HYBRID_TOKEN_REQUEST" : "Invlaid hybrid client attempt to get token",
        "INVALID_ORIGIN_TOKEN_REQUEST" : "Invlaid origin attempt to get token",
        "INVALID_WEB_USER_TOKEN_REQUEST": "Invlaid web user attempt to get token",
        "SERVICE_API_REQ_WITHOUT_TOKEN" : "Attempt to access service API without access_token",
        "SERVICE_API_HYBRID_TOKEN_RETRIVAL_ERROR" : "Error while retriving hybrid token for service API access",
        "SERVICE_API_WEB_TOKEN_RETRIVAL_ERROR" : "Error while retriving web token for service API access",
        "INVALID_ORIGIN_SERVICE_ACCESS" : "Attempt to access service API from invalid origin",
        "SOCKET_CONN_REQ_WITHOUT_TOKEN" : "Attempt to make socket connection without access_token",
        "SOCKET_CONN_HYBRID_TOKEN_RETRIVAL_ERROR" : "Error while retriving hybrid token for socket connection",
        "SOCKET_CONN_WEB_TOKEN_RETRIVAL_ERROR" : "Error while retriving web token for socket connection"
    }
}

module.exports = config;