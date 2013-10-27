define(function(){
    function Base(name, elements){
        this.name = name;
        this.elements = [elements];
    };

    Base.prototype = {
        prob: 100,
        defMode: "split",
        // "split" splits remaining probability amongst unspecified elements (for selection)
        // "full" sets probability of any unspecified to 100% (for merging)
        findProb: function(){
            // see if there's a base prob
            var prob;
            if( prob = this.elements[0].match(/^\d+/) ){
                this.elements[0] = this.elements[0].substr(prob[0].length);
                this.prob = parseInt(prob[0]);
            }
        },
        parse: function(sortedNames, allNames){
            var totalProb = 0;
            var unassignedProb = [];
            var i, j, prob, idx;
            this.findProb();
            for( i in sortedNames ){
                var name = sortedNames[i];
                j = 0;
                while( j < this.elements.length ){
                    var choice = this.elements[j];
                    if( typeof choice == "string" &&
                            ( idx = choice.indexOf(name) ) >= 0 ){
                        // make a space for the found name, and split it up
                        if( idx != 0 ){
                            this.elements.splice(j+1,0,undefined);
                            this.elements[j++] = choice.substr(0,idx);
                        }
                        this.elements[j] = { field: allNames[name] };
                        // see if there's a probability after the found name
                        var rest = choice.substr(idx+name.length);
                        var probLength = 0;
                        if( /^\d+/.test(rest) ){
                            prob = rest.match(/^\d+/)[0];
                            this.elements[j].prob = parseInt(prob) / this.prob;
                            probLength = prob.length;
                            totalProb += this.elements[j].prob;
                        }
                        else if( /^{(\d+, ?)*(\d+|\.\.\.)}/.test(rest) ){
                            prob = rest.match(/^{(\d+, ?)*(\d+|\.\.\.)}/)[0];
                            probLength = prob.length;
                            prob = prob.substring(1,prob.length-1);
                            var probs = prob.split(',');
                            for( var k in probs ) probs[k] = probs[k].trim() == '...' ? '...' : parseInt(probs[k].trim());
                            this.elements[j].prob = probs;
                            totalProb += this.elements[j].prob[0];
                        }
                        else {
                            this.elements[j].prob = 0;
                            unassignedProb.push(this.elements[j]);
                        }

                        // if there is stuff after the name, add a new element
                        var after = idx + name.length + probLength;
                        if( after < choice.length ){
                            this.elements.splice( j+1, 0, choice.substr(after) );
                        }
                    } else {
                        j++;
                    }
                }
            }

            // parse out regular characters
            for( i = 0; i < this.elements.length; i++ ){
                if( typeof this.elements[i] != "string" ) continue;
                var chars = this.elements[i].match(/[^0-9](\d+)?/g);
                this.elements.splice(i,1);
                for( j = 0; j < chars.length; j++ ){
                    var basicChar = {
                        field: {
                            str: chars[j][0],
                            output: function(){
                                return this.str;
                            }
                        },
                        prob: chars[j].length>1 ? 
                            parseInt(chars[j].substr(1)) / this.prob : 0
                    };
                    if( basicChar.prob > 0 ){
                        totalProb += basicChar.prob;
                    } else {
                        unassignedProb.push(basicChar);
                    }
                    this.elements.splice(i,0,basicChar);
                }
            }
            
            // assign any missing probabilities
            var leftoverprob = (1 - totalProb) / unassignedProb.length;
            for( i = 0; i < unassignedProb.length; i++ ){
                unassignedProb[i].prob = this.defMode == "split" ? leftoverprob : 1;
            }
        }
    };
    
    return Base;
});
