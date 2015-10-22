require( [ "ModalView" , "Validate" ] , function( MV , Validate ){
    var validate    = new Validate() ,
        _mv;
    _mv     = new MV( "validate" , $( document.body ) , function(){
        this.test1();
    } , {} );
    _mv.addModalEvent( {
        testCheckRule   : function(){
            console.log( validate.checkRule( "isPhone" , 13311111111 ) );
            console.log( validate.checkRule( "isPhone" , "1321dsadsa" ) );
            return this;
        } ,
        test1   : function(){
            validate.addVerifyItem( "demo-1" , $( "#demo-1" ) , {
                length      : [ "length[10,20]" , "islength" ],
                phone       : "isPhone" ,
                number      : "isNumber"
            } , function(){
                console.log( arguments );
            } );
            return this;
        } 
    } ).addViewEvent( {
        "#demo-1-btn::click"    : function(){
            console.log( validate.validateStatus( "demo-1" , { 
                    forceEnd        : true ,
                    handleCallback  : true 
                } ) );   
        }
    } ).init();
} );