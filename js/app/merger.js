define(['./base'],function(Base){
    function Merger(n,c){
        Base.call(this,n,c);
        this.defMode = "full";
    }
    Merger.prototype = new Base();
    Merger.prototype.output = function(){
        var out = "";
        for( var i = 0; i < this.elements.length; i++ ){
            var el = this.elements[i];
            if( el.prob.length ){
                for( var j = 0; j < el.prob.length; j++ ){
                    var prob = Math.random();
                    if( el.prob[j] == "..." ) j--;
                    if( prob > ( el.prob[j] / this.prob ) ) break;
                    out += el.field.output();
                }
            } else {
                var prob = Math.random();
                if( prob < el.prob ) out += el.field.output();
            }
        }
        return out;
    };
    return Merger;
});
