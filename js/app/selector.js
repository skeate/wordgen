define(['./base'],function(Base){
    function Selector(n,c){
        Base.call(this,n,c);
    }    
    Selector.prototype = new Base();
    Selector.prototype.output = function(){
        var prob = Math.random();
        var i = -1;
        while( prob > 0 )
            prob -= this.elements[++i].prob;
        return this.elements[i].field.output();
    };
    return Selector;
});
