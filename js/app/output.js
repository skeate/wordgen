define(['./base','./merger'], function(Base,Merger){
    function Output(o){
        Base.call(this,'',o);
    }
    Output.prototype = new Merger();
    /*
    Output.prototype.parse = function(allNames){
        var i, j;
        this.findProb();
        var namesAndProbs = this.elements[0]
            .match(/(\d+)?(.*)/)[2] // strip out base prob, if any
            .split(/[{}]/);         // split up into [name,probs,...]
        this.elements = [];
        for( i = 0; i < namesAndProbs.length; i+=2 ){
            if( namesAndProbs[i] == "" ) continue;
            if( typeof allNames[namesAndProbs[i]] == undefined )
                throw new Error('Name in output not found.');
            this.elements.push({
                field: allNames[namesAndProbs[i]],
                probs: namesAndProbs[i+1].split(',')
            });
        }
    };
    Output.prototype.output = function(){
        var out = "";
        for( var i = 0; i < this.elements.length; i++ ){
            var el = this.elements[i];
            for( var j = 0; j < el.probs.length; j++ ){
                var prob = Math.random();
                if( el.probs[j] == "..." ) j--;
                if( prob > ( el.probs[j] / this.prob ) ) break;
                out += el.field.output();
            }
        }
        return out;
    };
    */
    return Output;
});
