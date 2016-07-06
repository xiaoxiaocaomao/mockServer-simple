# Mock-Server
Launch a mock server to response HTTP requests.

# Feature
- user specify how to respond requests via api.json
- user specify which requests should be respond by mock server via config.json.
- apis not in config.json can be transferred to another remote service, which can be specified by user.
- expections defined in api.json can be replaced by data in data.json which are specified by user.

# Method
## setting
- apiJson

To specify api.json file location.

- config

To specify config.json file location.

- data.json

To specify data files to replace expection.

- remoteHost

To specify a remote service to respond HTTP requests.

```
    // example
    mockServer.setting({
        apiJson: __dirname + '/mock/api.json',
        config: __dirname + '/mock/config.json',
        dataFolder: __dirname + '/mock/data/',
        host: 'http://255.255.255.255/'
    });
```

## launch
To launch mock server and return service address.

```
    // example
    MOCK_SERVER = mockServer.launch('9898');
```

# Configuration
## api.json
To define how to respond a specific request, including path, method, param needed, expectation response. 

- Expection can be loaded from an external file, with format &file[xxxxxxxxx.json]&.
- If expection is an array, different PathParam will be returned with different result.
  If specify the last element of the expection array, and set its param with UNDEFINED, that will be seemed as the DEFAULT value.
  If do not specify the DEFAULT value, this request will return code 404.

Current support POST,PUT,GET.

```
    [{
        "path": "/sss/xxx/:aaa/:bbb",
        "method": "POST",
        "param": {
            "param1": "value1",
            "param2": "value2"
        },
        "expection": {
            "xxx": "xxx",
            "yyy": "yyy"
        }
    },{
        "path": "/sss/xxx1",
        "method": "GET",
        "param": {
            "param1": "value1",
            "param2": "value2"
        },
        "expection": "&file[data1.json]&"
    },{        
        "path": "/lalala/:pathParam1/:pathParam2",
        "method": "GET",
        "param": {
        },
        "expection": [
            {
                "param": {
                    "pathParam1": "1",
                    "pathParam2": "1"
                },
                "expection": "&file[a1.json]&"
            },
            {
                "param": {
                    "pathParam1": "2",
                    "pathParam2": "2"
                },
                "expection": "&file[a2.json]&"
            },
            {            
                "expection": "&file[a1.json]&"
            }
        ]
    }]
```

## config.json
The apis which are included in "mock" should be responded by this local mock server.

```
    {
        "mock": [
            "/lalala",
            "/sss/xxx1",
            "/sss/xxx"
        ]
    }
```

# With GULP
```
    //////////////////////////////////////
    /// MOCK 
    var isMOCK = true;

    var mockServer = require('mockServer-simple');
    var MOCK_SERVER;

    gulp.task("mock", function() {
        mockServer.setting({
            apiJson: __dirname + '/mock/api.json',
            config: __dirname + '/mock/config.json',
            dataFolder: __dirname + '/mock/data/',
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