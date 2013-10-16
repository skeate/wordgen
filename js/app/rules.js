define(['./selector','./merger','./output'],function(Selector, Merger, Output){
    function Rules(rules){
        this.selectors = [];
        this.mergers = [];
        this.substitutions = [];
        this.out = {};
        this.names = {};
        this.error = false;

        var temp,
            i;
        // categorize, parse out names
        for( i in rules ){
            // output rule
            if( rules[i][0] == '>' ){
                var outputRule = rules[i].substr(1);
                if( !/^(\d+)?(([^{]+{(\d+,)*(\d+|...)})+)$/.test(outputRule) ){
                    this.error = "Invalid output rule format.";
                    return;
                }
                this.out = new Output(rules[i].substr(1));
            }
            // selector rule
            else if( ( temp = rules[i].indexOf('=') ) >= 0 ){
                var selector = new Selector(
                    rules[i].substr(0,temp),
                    rules[i].substr(temp+1)
                );
                this.names[rules[i].substr(0,temp)] = selector;
                this.selectors.push(selector);
            }
            // merger rule
            else if( ( temp = rules[i].indexOf(':') ) >= 0 ){
                var merger = new Merger(
                    rules[i].substr(0,temp),
                    rules[i].substr(temp+1)
                );
                this.names[rules[i].substr(0,temp)] = merger;
                this.mergers.push(merger);
            }
            // substitution rule
            else if( ( temp = rules[i].indexOf('~') ) >= 0 ){
                var substitution = {};
                this.substitutions[rules[i].substr(0,temp)] =
                    rules[i].substr(temp+1);
            }
        }

        // sort names by length, then parse names in selectors/mergers/output
        var sortedNames = Object.keys(this.names).sort(function(a,b){
            return b.length - a.length;
        });
        for(i in this.selectors)this.selectors[i].parse(sortedNames,this.names);
        for(i in this.mergers)this.mergers[i].parse(sortedNames,this.names);
        try{
            this.out.parse(this.names);
        } catch (e) {
            this.error = e.message;
        }
    }
    Rules.prototype = {
        output: function(){
            try{
                if( this.error ) throw new Error(this.error);
                var out = "";
                for( var i = 0; i < 100; i++ ){
                    out += this.out.output() + ' ';
                }
                var regex;
                for( str in this.substitutions ){
                    regex = new RegExp(str,'g');
                    out = out.replace(regex,this.substitutions[str]);
                }
                return out;
            } catch (e) {
                return '<span class="error">'+e.message+'</span>';
            }
        }
    };
    return Rules;
});
