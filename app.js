var chokidar = require('chokidar');
var chalk = require('chalk');
var exec = require('child_process').exec;
var client = require('scp2');
var paths = require('./paths');
var remote = require('./remote');
var fsEvents = require('./FileSystemEvents');
var fsCommands = require('./FileSystemCommands');
var _path = require('path');

var sourceRootPath,destinationRootPath;

var isRemote = remote.isRemote;
var isWin = !isRemote;

if(isRemote){
    destinationRootPath = remote.server.tomcatPath;
} else {
    destinationRootPath = paths.destinationPath;
}

var sourceRootPath = paths.rootPath;
//var destinationRootPath = paths.destinationPath;

var boldGreen = chalk.bold.green;
var yellow = chalk.yellow;
var magenta = chalk.magenta;
var red = chalk.red;

var commands;

if(isWin){
    commands = fsCommands.windows
} else {
    commands = fsCommands.unix
}

var isReady = false;

//console.log('Please wait while the rAf is enlightened about the target environment...');
console.log('Listening for Changes at : '+sourceRootPath);

var rAd = chokidar.watch(sourceRootPath, {
    ignored: /[\/\\]\./,
    persistent: true,
    ignoreInitial: true
})


rAd.on('all', function(event, path) {
    if(isWin){
        localDeploy(event, path);
    } else {
        remoteDeploy(event, path);
    }
});

function localDeploy(event, path){
    var OriginatingPath = path;
    var relativePath = OriginatingPath.slice(sourceRootPath.length);
    var originalEvent = event;

    var targetPath = destinationRootPath + relativePath;

    var fileName = OriginatingPath.replace(/^.*[\\\/]/, '');
    var c;
    switch (event) {
        case fsEvents.FILE_CHANGED:
        case fsEvents.FILE_ADDED:
            c = commands.CopyFile([OriginatingPath,targetPath]);
            break;
        case fsEvents.FILE_DELETED:
            c = commands.DeleteFile([targetPath]);
            break;
        case fsEvents.FOLDER_ADDED:
            c = commands.CopyFolder([OriginatingPath,targetPath]);
            break;
        case fsEvents.FOLDER_DELETED:
            c = commands.DeleteFolder([targetPath]);
            break;
        default:
            c = 'echo "Error"';
    }
    //execute the command here
    exec(c, function(error, stdout, stderr) {
        if(error){
            console.log(red('Error : ')+magenta(c));
        } else{
            console.log(boldGreen('Success : ')+magenta(c));
        }
    });
}

function remoteDeploy(event, path){
    var relativePath = path.slice(sourceRootPath.length);
    relativePath = relativePath.replace(/\\/g,'/');
    var fileName = _path.basename(relativePath);

    var fileNameLocation = relativePath.indexOf(fileName);

    var relativePathComponent = relativePath.split(fileName)[0];

    var targetPath = remote.server.tomcatPath + relativePathComponent;

    var scpOptions = {};

    client.scp(path, {
        host:remote.server.host,
        username:remote.server.username,
        password:remote.server.password,
        path:targetPath
    }, function(err) {
        if(err){
            console.log('Error - '+red(err));
        } else{
            console.log(boldGreen('Deploy Success @Host - '+remote.server.host) + yellow('  ####   File Name - ') + boldGreen(fileName));
        }
    });

}
