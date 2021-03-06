var inquirer    = require( "inquirer" ),
    path        = require( "path" );

function Build( kulor , bower , grunt , tool , log , callback ){
    this.kulor      = kulor;
    this.bower      = bower;
    this.grunt      = grunt;
    this.tool       = tool;
    this.log        = log;
    this.callback   = callback;
    this.init();
}


Build.fn    = Build.prototype   = {
    constructor     : Build ,
    questions       : [
        {
            message     : "app name:" ,
            name        : "name" ,
            default     : "kulorApp" ,
            type        : "input"
        } ,
        {
            message     : "app description:" ,
            name        : "description" ,
            default     : "a simple kulorApp" ,
            type        : "input"
        } ,
        {
            message     : "version:" ,
            name        : "version" ,
            default     : "0.0.1" ,
            type        : "input"
        } ,
        {
            message     : "homepage:" ,
            name        : "homepage" ,
            default     : "" ,
            type        : "input"
        } ,
        {
            message     : "author:" ,
            name        : "authorName" ,
            default     : "" ,
            type        : "input"
        } ,
        {
            message     : "author email:" ,
            name        : "authorEmail" ,
            default     : "" ,
            type        : "input"
        } 
    ] ,
    getPackageJson  : function( callback ){
        var _json   = JSON.parse( this.grunt.file.read( path.resolve( this.kulor.cacheDir , "kulor/" , "package.json" ) ) );
        inquirer.prompt( this.questions , function( answers ){
            answers.author          = {
                name        : answers.authorName ,
                email       : answers.authorEmail
            };
            answers.dependencies    = _json.devDependencies;
            delete answers.authorName;
            delete answers.authorEmail;
            console.log( answers );
            inquirer.prompt( [ {
                message     : "Is the package.json look good ?" ,
                default     : true ,
                name        : "good" ,
                type        : "confirm"
            } ] , function( answer ){
                if( answer.good ){
                    callback( answers );
                } else {
                    process.exit();
                }
            } );
        } );
    } ,
    init            : function(){
        var _dir    = path.resolve( this.kulor.cacheDir , "kulor" ),
            _self   = this ,
            _done   = function( json ){
                if( json ){
                    _self.grunt.file.write( "./package.json" , JSON.stringify( json , null , "    " ) , { force : true } );  
                }
                _self.callback();
            } ,
            _path;

        this.tool.file.copy( path.resolve( _dir , "src/js" ) , "./src/" );
        this.tool.file.copy( path.resolve( _dir , "grunt" ) , "./" );
        this.tool.file.copy( path.resolve( _dir , "src/layout" ) , "src/" );
        this.tool.file.copy( path.resolve( _dir , "src/less" ) , "src/" );
        this.tool.file.copy( path.resolve( _dir , "src/index.jade" ) , "src/index.jade" );
        this.tool.file.copy( path.resolve( _dir , "Gruntfile.js" ) , "Gruntfile.js" );

        if( !this.grunt.file.exists( "./kulor.json" ) ){
            this.tool.file.copy( path.resolve( _dir , "kulor.json" ) , "kulor.json" );
        }

        if( !this.grunt.file.exists( path.resolve( "package.json" ) ) ){
            this.getPackageJson( _done );  
        } else {
            _done();
        }
    }
}

module.exports = function( bower , grunt , tool , log , callback ) {
    new Build( this , bower , grunt , tool , log , callback );
}