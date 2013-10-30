define [
    'cs!app/selector'
    'cs!app/merger'], (Selector, Merger, Output) ->
    class Rules
        constructor: (rules) ->
            @selectors = []
            @mergers = []
            @substitutions = []
            @out = {}
            @names = {}
            @error = false
            # categorize, parse out names
            for rule in rules
                # output rule
                if rule[0] == '>'
                    outputRule = rule.substr 1
                    outputCheck = /// ^
                        (\d+)?          # base probability
                        ([^0-9{]        # any non-number or {
                        (\d+            # single probability
                        |{(\d+, ?)+     # list of probabilities
                        (\d+|\.\.\.)}   # - ending in either '...' or a number
                        )?              # don't need probability at all
                        )+$///          # can have multiple element/prob pairs
                    if !outputCheck.test outputRule
                        @error = "Invalid output rule format."
                        return
                    @out = new Merger '', rule.substr 1
                # selector rule
                else if ( temp = rule.indexOf('=') ) >= 0
                    sel = new Selector rule.substr(0,temp), rule.substr temp+1
                    @names[rule.substr 0,temp] = sel
                    @selectors.push sel
                # merger rule
                else if ( temp = rule.indexOf(':') ) >= 0
                    merger = new Merger rule.substr(0,temp), rule.substr(temp+1)
                    @names[rule.substr 0,temp] = merger
                    @mergers.push merger
                # substitution rule
                else if ( temp = rule.indexOf('~') ) >= 0
                    substitution = {}
                    @substitutions[rule.substr 0,temp] = rule.substr temp+1
            # sort names by length, then parse names in selectors/mergers/output
            sortedNames = Object.keys(@names).sort (a,b) -> b.length - a.length
            try
                for sel in @selectors
                    sel.parse sortedNames, @names
                for merger in @mergers
                    merger.parse sortedNames, @names
                if @out.parse?
                    @out.parse sortedNames, @names
                else
                    @error = "No output rule."
            catch e
                console.log e.stack
                @error = e.message
        output: ->
            try
                if @error then throw new Error @error
                out = "";
                for i in [1..100]
                    out += @out.output() + ' '
                for str, rep of @substitutions
                    regex = new RegExp str, 'g'
                    out = out.replace regex, rep
                return out
            catch e
                console.log e.stack
                '<span class="error">'+e.message+'</span>'
