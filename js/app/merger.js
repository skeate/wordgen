define(['./base'],function(Base){
    function Merger(n,c){
        Base.call(this,n,c);
    }
    Merger.prototype = new Base();
    Merger.prototype.output = function(){
        var out = "";
        for( var i = 0; i < this.elements.length; i++ ){
            out += this.elements[i].field.output();
        }
        return out;
    };
    return Merger;
});
