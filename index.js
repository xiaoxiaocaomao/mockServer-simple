var spawn = require('child_process').spawn;
var fs = require('fs');
var mockTask;

/**
 * @name  launch
 * @description launch the local mock server
 * @param  {string} port
 */
function launch(port) {
    // if existing process, then kill it
    if (mockTask) mockTask.kill('SIGINT');
    
    // port configuration
    var config = JSON.parse(readConfig());
    config.port = port;
    writeConfig(JSON.stringify(config));

    // process
    mockTask = spawn('node', [__dirname + '/mockServer.js'], {
        killSignal: 'SIGINT'
    });

    return 'http://localhost:' + port;
}
module.exports.launch = launch;

/**
 * @name setting
 * @description set setting
 * @param { object} param 
 */
function setting(param) {
    var config = JSON.parse(readConfig());
    config.apiJson = param.apiJson;
    config.config = param.config;
    config.remote = param.host;
    config.dataFolder = param.dataFolder;
    writeConfig(JSON.stringify(config));
}
module.exports.setting = setting;

/**
 * @name readConfig
 * @description read configuration
 */
function readConfig() {
    return fs.readFileSync(__dirname + '/config.json', 'utf8');
}

/**
 * @name writeConfig
 * @description write configuration
 * @param {string} content
 */
function writeConfig(content) {
    return fs.writeFileSync(__dirname + '/config.json', content, 'utf8');
}