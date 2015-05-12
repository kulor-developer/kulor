module.exports = function( bower , grunt , tool , log , callback ) {
    var _dir    = this.cacheDir + "kulor/";
    if( grunt.file.exists( _dir + "Gruntfile.js" ) ){
        grunt.file.copy( _dir + "Gruntfile.js" , "./Gruntfile.js"  );
    }
    if( grunt.file.exists( _dir + "package.json" ) ){
        grunt.file.copy( _dir + "package.json" , "./package.json"  );    
    }
    if( grunt.file.isDir( "src" ) ){
        log( "folder src exists..." );
    } else {
        tool.file.copy( _dir + "src/js" , "./src/js" );
        tool.file.copy( _dir + "grunt" , "./grunt" );
        log( "kulor init success..." );
    }
    callback();
}