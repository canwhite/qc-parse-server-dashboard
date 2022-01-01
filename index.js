// Example express application adding the parse-server module to expose Parse
// compatible API routes.

const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const path = require('path');
const args = process.argv || [];
const test = args.some(arg => arg.includes('jasmine'));

//是否允许http
var allowInsecureHTTP = true;

/* const databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI; */
const app = express();
var config = {
  databaseURI: 'mongodb://localhost:27017/dev', // 你的Mongo数据库地址
  cloud: path.join(__dirname, '/cloud/main.js' ),          // 云代码文件的路径，绝对路径
  appId: 'myAppId',                             // appId  
  masterKey: 'myMasterKey',                     // masterKey
  fileKey: 'optionalFileKey',                   // fileKey
  javascriptKey:"myJsKey",
  serverURL: 'http://localhost:1337/parse'      // 设置Parse服务地址
}
var api = new ParseServer(config);
app.use('/public', express.static(path.join(__dirname, '/public')));


//parse路径
app.use('/parse', api);
//根目录
app.get('/', function (req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});
//test标签
app.get('/test', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

const port = process.env.PORT || 1337;
if (!test) {
  const httpServer = require('http').createServer(app);
  httpServer.listen(port, function () {
    console.log('parse-server-example running on port ' + port + '.');
  });
  ParseServer.createLiveQueryServer(httpServer);
}

//启动一下dashboard
var ParseDashboard = require('parse-dashboard');

var dashboard = new ParseDashboard({
  apps: [
    {
      appId: config.appId,
      masterKey:  config.masterKey,
      serverURL:  config.serverURL,
      appName: 'MyApp'
    }
  ],
  users: 
  [
    {
        user:"admin",
        pass:"admin"
    }
  ]
},allowInsecureHTTP);
// make the Parse Dashboard available at /
app.use('/dash', dashboard);

var port2 =  4040;
var httpServer = require('http').createServer(app);
httpServer.listen(port2, function() {
  console.log('parse-dashboard-example running on port ' + port2 + '.');
});

module.exports = {
  app,
  config,
};
