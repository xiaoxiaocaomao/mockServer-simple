# mocker
Launch a mock server to response HTTP requests.

# feature
- user specify how to respond requests via api.json
- user specify which requests should be respond by mock server via config.json.
- apis not in config.json can be transferred to another remote service, which can be specified by user.

# method
## setting
- apiJson

To specify api.json file location, which will be written into configuration file.

- config

To specify config.json file location, which will be written into configuration file.


- remoteHost

To specify a remote service to respond HTTP requests, which will be written into configuration file.

```
    // example
    mockServer.setting({
        apiJson: __dirname + '/mock/api.json',
        config: __dirname + '/mock/config.json',
        host: 'http://255.255.255.255/'
    });
```

## launch
To launch mock server and return service address.

```
    // example
    MOCK_SERVER = mockServer.launch('9898');
```

# configuration
## api.json
To define how to respond a specific request, including path, method, param needed, expectation response.

```
    [{
        "path": "/sss/xxx",
        "method": "POST",
        "param": {
            "param1": "value1",
            "param2": "value2"
        },
        "expection": {
            "xxx": "xxx"
        }
    },{
        "path": "/sss/xxx1",
        "method": "GET",
        "param": {
            "param1": "value1",
            "param2": "value2"
        },
        "expection": {
            "xxx": "xxx"
        }
    },{
        "path": "/sss/xxx2",
        "method": "PUT",
        "param": {
            "param1": "value1",
            "param2": "value2"
        },
        "expection": {
            "xxx": "xxx"
        }
    }]
```

## config.json
The apis which are included in "mock" should be responded by this local mock server.

```
    {
        "mock": [
            "/rest/access/userInfo",
            "/rest/access/login"
        ]
    }
```

# with GULP
```
    //////////////////////////////////////
    /// MOCK 
    var isMOCK = true;

    var mockServer = require('mocker-iclassedu');
    var MOCK_SERVER;

    gulp.task("mock", function() {
        mockServer.setting({
            apiJson: __dirname + '/mock/api.json',
            config: __dirname + '/mock/config.json',
            host: 'http://255.255.255.255/'
        });
        MOCK_SERVER = mockServer.launch('9898'); 
    });

    if (isMOCK) {
        gulp.start("mock");
        SERVER_PROXY = MOCK_SERVER;
        console.log("##Starting MOCK at:" + MOCK_SERVER);
    }
    ///////////////// MOCK END ////////////////

```

# License
MIT