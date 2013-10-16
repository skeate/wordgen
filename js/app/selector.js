define(['./base'],function(Base){
    function Selector(n,c){
        Base.call(this,n,c);
    }    
    Selector.prototype = new Base();
    Selector.prototype.output = function(){
        var prob = Math.random();
        var i = -1;
        while( prob > 0 && typeof this.elements[++i] != "undefined" )
            prob -= this.elements[i].prob;
        return i == this.elements.length ? '' : this.elements[i].field.output();
    };
    return Selector;
});
