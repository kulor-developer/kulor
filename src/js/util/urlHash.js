define( "UrlHash" , [ "Base" ] , function( Base ){
    /*!
     *  urlHash提取/保存 管理
     */
    var UrlHash = Base.extend( function(){
        this.url    = window.location.href;
    } , {
        gotoUrl     : function( url , params ){
            window.location.href    = this.getPageUrl( url , params );
            return this;
        } ,
        getPageUrl  : function( url , params ){
            var _urlHash    = [];
            for( var a in params ){
                _urlHash.push( a + "=" + encodeURIComponent( params[ a ] ) );
            }
            return url + "?" + _urlHash.join( "&" );
        } ,
        getHash     : function(){
            var _self   = this ,
                _url ,
                _keyVal ,
                _json   = {};
            return this.urlHash || ( function(){
                if( _self.url.indexOf( "?" ) > -1 ){
                    _url    = _self.url.replace( /.*\?/ , "" ).split( "&" );
                    for( var i = _url.length; i--; ){
                        _keyVal     = _url[ i ].split( "=" );
                        _json[ _keyVal[ 0 ] ]   = decodeURIComponent( _keyVal[ 1 ] );
                    }
                }
                _self.urlHash   = _json;
                return _json;
            } )();
        }
    } );
    return UrlHash;
} );