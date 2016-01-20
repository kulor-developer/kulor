define( "Validate" , [ "Base" ] , function( Base ){
    /*!
     *  验证插件
     */
    var Validate ,
        tool;

    tool        = {
        setVerifyItem   : function( item ){
            var _self = this ,
                _$form= item.__$form.length ? item.__$form : $( item.__$form.selector ) ,
                _rules= item.inputRules;
            _$form.find( "input" ).each( function(){
                var _item  = _rules[ this.name ],
                    _rule   = [];
                if( _item ){
                    if ( typeof _item === "string" ) {
                        _item = {
                            rules   : _item
                        }
                    } else if( _item instanceof Array ){
                        _item = {
                            rules   : _item[ 0 ] ,
                            content : _item[ 1 ] || "",
                            param   : _item[ 2 ]
                        }
                    }
                    _item.$input = $( this );
                    _item.rules = _item.rules.replace( /^\s+/, "" )
                                    .replace( /\s+$/, "" )
                                    .replace( /\s+/gi , " " )
                                    .replace( /\[\s*([^\W]*)\s*\,\s*([^\W]*)\s*\]/gi , "[$1,$2]" )
                                    .split( " " );
                    for( var i = _item.rules.length; i--; ){
                        if ( /.+\[.+\]/.test( _item.rules[ i ] ) ) {
                            _item.rules[ i ] = _item.rules[ i ].split( "[" );
                            _rule.push( {
                                ruleName    : _item.rules[ i ][ 0 ] ,
                                param       : JSON.parse( "[" + _item.rules[ i ][ 1 ] )
                            } );
                        } else {
                            _rule.push( {
                                ruleName    : _item.rules
                            } );
                        }
                    }
                    _item.rules = _rule;
                    _rules[ this.name ] = _item;
                    _item.$input.blur( function(){
                        func( _item.$input , _self.handleVerifyItem( _item ) , _item.content , _item );
                    } );
                }
            } );
            item.init   = true;
            return this;
        }
    }

    Validate    = Base.extend( function(){
        this._validateConfig = { rules : {} };
    } , {
        __validateConfig      : {
            rules           : {} ,
            verifyItems     : {}
        } ,
        /*!
         *  验证一个表单
         *  @id     {string}    表单的id  对应addVerifyItem  id
         *  @opt    {bool|object}
         *      forceEnd        {bool} 是否执行到最后
         *      handleCallback  {bool} 是否执行之前定义的回调函数
         */
        validateStatus    : function( id , opt ){
            var _rtn = [],
                _input ,
                _verify ,
                _inputRule;
            opt     = typeof opt == "object" ? opt : {};
            if ( _inputRule = this.__validateConfig.verifyItems[ id ] ) {
                if( !this.__validateConfig.verifyItems[ id ].init ){
                    tool.setVerifyItem.call( this , this.__validateConfig.verifyItems[ id ] );
                }
                for ( var a in _inputRule.inputRules ) {
                    _input  = _inputRule.inputRules[ a ];
                    _verify = this.handleVerifyItem( _input );
                    if ( opt.handleCallback ) {                        
                        _inputRule.callbackFunc( _input.$input , _verify , _input.content , _input );
                    }
                    if ( !opt.forceEnd && !_verify ) {
                        return false;
                    }  else if( !_verify ) {
                        _rtn.push( _input );
                    }
                }
            }
            return opt.forceEnd && _rtn.length ? _rtn : true;
        } ,
        /*!
         *  执行验证规则
         *  @ruleInput  {object}    待验证的ruleInput值
         *  @forceEnd   {bool}      验证完全所有的规则
         */
        handleVerifyItem  : function( ruleInput , forceEnd ){
            var _rtn = {},
                _rule,
                _val = ruleInput.$input.val();
            for( var i = ruleInput.rules.length; i--; ){
                _rule = this._validateConfig.rules[ ruleInput.rules[ i ].ruleName ] || this.__validateConfig.rules[ ruleInput.rules[ i ].ruleName ];
                if ( _rule ) {
                    if ( !_rule( _val , ruleInput.rules[ i ].param , ruleInput ) ) {
                        if ( !forceEnd ) {
                            return false;
                        } else {
                            _rtn[ ruleInput.rules[ i ].ruleName ] = false;
                        }
                    }
                }
            }
            return forceEnd ? _rtn : true;
        } ,
        /*!
         *  添加一个验证模块
         *  @id         {string}        验证模块id
         *  @$form      {jQueryDom}     
         *  @rules      {opt}
         *  @func       {function}      回调方法
         */
        addVerifyItem     : function( id , $form , rules , func ){
            if ( $.isFunction( func ) ) {
                this.__validateConfig.verifyItems[ id ] = {
                    __id        : id ,
                    __$form     : $form ,
                    inputRules  : rules ,
                    callbackFunc: func ,
                    init        : false
                }
            }
            return this;
        },
        /*!
         *  新增验证规则
         *  @ruleName       {string|object}
         *  @ruleFunc       {function}  要求返还bool值
         *  @isGlobal       {bool}      是否设置为全局的验证规则
         */
        addRules    : function( ruleName , ruleFunc , isGlobal ){
            var _inputs = {};
            if ( typeof ruleName == "string" && $.isFunction( ruleFunc ) ) {
                _inputs[ ruleName ] = ruleFunc;
            } else if( typeof ruleName === "object"  ){
                _inputs = ruleName;
                isGlobal = ruleFunc;
            }
            $.extend( this[ isGlobal ? "__validateConfig" : "_validateConfig" ].rules , _inputs );
            return this;
        } ,
        /*!
         *  执行单个验证规则
         *  @ruleName   {string}    待验证的规则名称
         *  @arguments  {str ...}   验证规则值
         */
        checkRule   : function( ruleName ){
            var _opt ,
                _rules  = $.extend( this.__validateConfig.rules , this._validateConfig.rules );
            if( _rules[ ruleName ] ){
                _opt    = Array.prototype.slice.call( arguments );
                _opt    = _opt.slice( 1 , _opt.length );
                return _rules[ ruleName ].apply( this , _opt );
            }
            return false;
        }
    } );

    /*!
     *  新增默认的验证类型
     */
    new Validate().addRules( {
        email   : function( str , opt ){
            return /.+\@.+\..+/.test( str );
        } , 
        length  : function( str , array ){
            var _len;
            if ( str ) {
                array = array instanceof Array ? array : [ 0 ];
                _len = $.trim( str ).length;
                return _len < array[ 0 ] ? false :
                            !array[ 1 ] ? true :
                                _len > array[ 1 ] ? false : true;
            } else {
                return false;
            }
        } ,
        isNumber  : function( str ){
            return /^\d+$/.test( str );
        } ,
        isPhone     : function( num ){
            return /^1[3|4|5|7|8]\d{9}$/.test( num );
        }
    } , true );

    return Validate;
} );