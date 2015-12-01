var chokidar = require('chokidar');
var fs = require('fs');
var chalk = require('chalk');
var client = require('scp2');
var scp = require('scp');
var exec = require('child_process').exec;
var ssh = require('node-ssh-exec');
var SimpleSSH = require('simple-ssh');
var paths = require('./paths');
var remote = require('./remote');

var rootPath = paths.rootPath;
var destinationPath = paths.destinationPath;

var server = remote.server;
var isRemote = remote.isRemote;

var boldGreen = chalk.bold.green;
var yellow = chalk.yellow;
var magenta = chalk.magenta;

var simpleSSH = new SimpleSSH({
    host: '10.88.195.16',
    user: 'ionadmin',
    pass: 'ionadmin'
});

var watcher = chokidar.watch(rootPath, {ignored: /^\./, persistent: true});

console.log('Looking for Changes at : '+chalk.cyan(rootPath));

watcher
  .on('add', function(path) {makeChanges(path);})
  .on('unlink', function(path) {/*makeChanges(path);*/})
  .on('change', function(path) {makeChanges(path);});

function makeChanges(path){
	var relativePath = path.slice(rootPath.length);
	
	console.log('relativePath - '+relativePath);
	
    var fileName = relativePath.replace(/^.*[\\\/]/, '');
	
	console.log('fileName - ' + fileName);
	
    var targetPath = destinationPath+relativePath;
	
	console.log('targetPath - ' + targetPath);
	
    var fileBasePath = path.split(fileName)[0];
	
	console.log('fileBasePath - ' + fileBasePath);
	
	fs.createReadStream(path).pipe(fs.createWriteStream(targetPath));
      /*if(isRemote){
          var remoteRootUrl = '/share/apps/apache-tomcat/7.0.42/webapps/ir';
          var remotePath = remoteRootUrl+relativePath;
          var relPath = remotePath.split(fileName);
          relPath = relPath[0];
          relPath = relPath.split("\\").join("/");
          server.path = relPath;
          server.file = path;
          try{
                //exec
                exec('cd '+fileBasePath, function(error, stdout, stderr) {
                    if(error){
                        console.log(error);
                    } else {
                        console.log('Sending');
                        client.scp(path, {
                            host: '10.88.195.16',
                            username: 'ionadmin',
                            password: 'ionadmin',
                            path: '/home/ionadmin/Aditya'
                        }, function(err) {
                        });

                        simpleSSH.exec('sudo cp /home/ionadmin/Aditya/assayWizardPageView.js /share/apps/apache-tomcat/7.0.42/webapps/ir/public-resources/js/app/views/assay/', {
                            pty: true,
                            out: console.log.bind(console)
                        }).start();
                    }
                });
          }catch(e){
              console.log(e);
          }
      } else{
          fs.createReadStream(path).pipe(fs.createWriteStream(targetPath));
      }*/

      /*console.log(boldGreen('- Copied : '+fileName));
      console.log(yellow('    - To : '+targetPath));
      console.log(magenta('----------------------'));*/
}