define(function(){
    function Base(name, elements){
        this.name = name;
        this.elements = [elements];
    };

    Base.prototype = {
        prob: 100,
        findProb: function(){
            // see if there's a base prob
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
                        // see if there's a probability after the found name
                        prob = choice.substr(idx+name.length).match(/^\d+/);
                        this.elements[j] = {
                            field: allNames[name],
                            prob: prob ? parseInt(prob[0]) / this.prob : 0
                        };
                        if( prob ){
                            totalProb += this.elements[j].prob;
                        } else {
                            unassignedProb.push(this.elements[j]);
                        }

                        // if there is stuff after the name, add a new element
                        var after = idx + name.length + (prob?prob[0].length:0);
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
                var chars = this.elements[i].match(/\w(\d+)?/g);
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
                unassignedProb[i].prob = leftoverprob;
            }
        }
    };
    
    return Base;
});
