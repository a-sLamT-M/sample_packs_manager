const fs = require("fs")
const pathUtils = require("path")

export const itDir = function (path) {
    let files = [], dirs = []
    console.log("32")
    try {
        fs.readdirSync(path, function(err, files) {
            if(err) throw err;
            files.forEach(file => {
                const fullPath = "${dPath}${path}";
                console.log(fullPath)
                if ( fs.stat(fullPath).isFile()){
                    console.log(fullPath)
                    files.push(fullPath);
                }
                else
                {
                    console.log(fullPath)
                    dirs.push(fullPath);
                }
            })
        })
        console.log(files)
        if (dirs.length !== 0) {
            traverseDir(dirs.pop)
        }
        console.log(files)
        return files
    }
    catch (e) {
        console.error(e)
        return [];
    }
}

export const traverseDir = () => {
    const files = [] ,dirs = [];
    return function dirIt(directory) {
        try {
            let dirContent = fs.readdirSync(directory);
            dirContent.forEach( path => {
                const fullPath = pathUtils.join(directory, path)
                if ( fs.statSync(fullPath).isFile() )
                    files.push(fullPath);
                else
                    dirs.push(fullPath);
            });
            if ( dirs.length !== 0 )
                dirIt(dirs.pop());
            return files;
        } catch(ex) {
            return false;
        }
    };

};