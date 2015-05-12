module.exports = function( kulor , grunt , tool , log ) {
    var _dir    = kulor.cacheDir + "kulor-git/";
    grunt.file.copy( _dir + "Gruntfile.js" , "Gruntfile.js"  );
    grunt.file.copy( _dir + "package.json" , "package.json"  );
    if( grunt.file.isDir( kulor.cwd + "src/" ) ){
        log( "folder src exsits..." );
    } else {
        tool.file.copy( _dir + "src/js" , "src/js" );
        tool.file.copy( _dir + "grunt" , "./grunt" );
        log( "kulor init success..." );
    }
}