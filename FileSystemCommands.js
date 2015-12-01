function commandBuilder(command, params){
    var finalCommand = command;

    if(params.length){
        params.forEach(function(param){
            finalCommand+=' '+param+' ';
        });
        return finalCommand;
    }
    return false;

}

var commands = {
    windows:{
        copyFile:'COPY /Y',
        deleteFile:'DEL /Q',
        copyFolder:'XCOPY /S',
        deleteFolder:'RMDIR /S /Q',
        commands:{
            CopyFile: function(files){
                var result = commandBuilder(commands.windows.copyFile, files);
                return result;
            },
            CopyFolder: function(folders){
                var result = commandBuilder(commands.windows.copyFolder, folders);
                return result;
            },
            DeleteFile: function(file){
                var result = commandBuilder(commands.windows.deleteFile, file);
                return result;
            },
            DeleteFolder: function(folder){
                var result = commandBuilder(commands.windows.deleteFolder, folder);
                return result;
            }
        }
    },
    unix:{
        copyFile:'copy',
        deleteFile:'rm -f',
        copyFolder:'scp',
        deleteFolder:'rm -rf',
        commands:{
            CopyFile: function(files){
                var result = commandBuilder(commands.unix.copyFile, files);
                return result;
            },
            CopyFolder: function(folders){
                var result = commandBuilder(commands.unix.copyFolder, folders);
                return result;
            },
            DeleteFile: function(file){
                var result = commandBuilder(commands.unix.deleteFile, file);
                return result;
            },
            DeleteFolder: function(folder){
                var result = commandBuilder(commands.unix.deleteFolder, folder);
                return result;
            }
        }
    }
}

module.exports = {
    windows: commands.windows.commands,
    unix: commands.unix.commands
}
