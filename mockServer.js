var express = require('express');
var server = express();
var fs = require('fs');
var request = require('request');
var bodyParser = require('body-parser');

// DEFAULT
var PORT = '9898';
var PROXY_SERVER = '';
var CONFIG_DIR = '';
var API_DIR = '';

// GET local configuration
var _config = fs.readFileSync(__dirname + '/config.json', 'utf8');
_config = JSON.parse(_config);
PORT = _config.port || PORT;
PROXY_SERVER = _config.remote;
CONFIG_DIR = _config.config;
API_DIR = _config.apiJson;

// re-direct to remote server
var reProxyMiddleware = function(req, res, next) {

    var shouldMock = false;    

    if(CONFIG_DIR) {
        // read configuration file
        var config = fs.readFileSync(CONFIG_DIR, 'utf8');
        var mockConfigObj = JSON.parse(config),
            mockList = mockConfigObj.mock;

        for (var i = 0, lenMockList = mockList.length; i < lenMockList; i++) {
            if (req.originalUrl.indexOf(mockList[i]) > -1) {
                shouldMock = true;
                break;
            }
        }
    }

    // if does not need mock at local, request to remote server
    if (!shouldMock) {
        var url = PROXY_SERVER + req.url;
        var reProxyReq;
        var options = {
            url: url,
            headers: req.headers,
            method: req.method,
            baseUrl: req.baseUrl
        };

        if (req.method === 'POST') {
            options.json = req.body;
        }

        reProxyReq = request(url);

        req.pipe(reProxyReq).pipe(res);

    } else {
        next();
    }
};

// only user this middleware at pointing proxy server
if (PROXY_SERVER) {
    server.use(reProxyMiddleware);
}

// GET post body
// json --
server.use(bodyParser.json());
// form --
server.use(bodyParser.urlencoded({
    extended: false
}));


// router (api.json)
if (API_DIR) {
    var _apiRouter = fs.readFileSync(API_DIR, 'utf8');
    _apiRouter = JSON.parse(_apiRouter);

    for (var i = 0, lenPosts = _apiRouter.length; i < lenPosts; i++) {
        var reqPiece = _apiRouter[i];

        (function(reqPiece) {
            switch (reqPiece.method) {
                case 'GET':
                    server.get(reqPiece.path, function(req, res) {
                        _response(req.query, res);
                    });
                    break;
                case 'POST':
                    server.post(reqPiece.path, function(req, res) {
                        _response(req.body, res);
                    });
                    break;
                case 'PUT':
                    server.put(reqPiece.path, function(req, res) {
                        _response(req.body, res);
                    });
                    break;
                default:
                    server.get(reqPiece.path, function(req, res) {
                        _response(req.query, res);
                    });
            }

            /**
             * _response
             * @description response action
             * @param  {object} param request parameters
             * @param  {object} res
             */
            function _response(param, res) {
                // check parameters
                if (checkParam(param, reqPiece.param)) {
                    res.send(reqPiece.expection);
                } else {
                    res.send('error!');
                }
            }

            /**
             * @name checkParam
             * @description check parameters（refParam must in reqParam）
             * @param { object} reqParam requst parameters
             * @param { object} refParam expection parameters(from api.json)
             */
            function checkParam(reqParam, refParam) {

                for (var p in refParam) {
                    if (!refParam.hasOwnProperty(p)) {
                        continue;
                    };
                    // if request parameter has not this property
                    if (!reqParam.hasOwnProperty(p)) {
                        return false;
                    }
                    // compare value
                    if (reqParam[p] === refParam[p]) {
                        continue;
                    };
                    // if value not equal, check whether it is an object
                    if (typeof refParam[p] !== "object") {
                        return false;
                    }
                    // If so, go on checking
                    checkParam(reqParam[p], refParam[p]);
                }
                return true;
            }

        })(reqPiece);

    }
}

// LISTEN
server.listen(PORT);