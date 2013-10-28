define ->
    class Base
        constructor: (@name, elements) ->
            @elements = [elements]
            @prob = 100
            ###
            "split" splits remaining probability amongst unspecified
                elements (for selection)
            "full" sets probability of any unspecified to 100% (for merging)
            ###
            @defMode = 'split'

        findProb: ->
            # see if there's a base prob
            if prob = @elements[0].match /^\d+/
                @elements[0] = @elements[0].substr prob[0].length
                @prob = parseInt prob[0]

        parse: (sortedNames, allNames) ->
            totalProb = 0
            unassignedProb = []
            @findProb()
            for name in sortedNames
                j = 0
                while j < @elements.length
                    choice = @elements[j]
                    if typeof choice == "string" and
                            ( idx = choice.indexOf name ) >= 0
                        # make a space for the found name, and split it up
                        if idx != 0
                            @elements.splice(j+1,0,undefined)
                            @elements[j++] = choice.substr 0, idx
                        @elements[j] = field: allNames[name]
                        # see if there's a probability after the found name
                        rest = choice.substr idx+name.length
                        probLength = 0
                        if /^\d+/.test rest
                            prob = rest.match(/^\d+/)[0]
                            @elements[j].prob = parseInt(prob) / @prob
                            probLength = prob.length
                            totalProb += @elements[j].prob
                        else if /^{(\d+, ?)*(\d+|\.\.\.)}/.test rest
                            prob = rest.match(/^{(\d+, ?)*(\d+|\.\.\.)}/)[0]
                            probLength = prob.length
                            prob = prob.substring 1, prob.length-1
                            probs = prob.split ','
                            probs = (p.trim() for p in probs)
                            @elements[j].prob = probs
                            totalProb += @elements[j].prob[0]
                        else
                            @elements[j].prob = 0
                            unassignedProb.push @elements[j]
                        # if there is stuff after the name, add a new element
                        after = idx + name.length + probLength
                        if after < choice.length
                            @elements.splice j+1, 0, choice.substr(after)
                    else
                        j++

            # parse out regular characters
            for i in [0..@elements.length] by 1
                if typeof @elements[i] != "string"
                    continue
                split = @elements[i].split /([^0-9]{.*?}|[^0-9]\d+|[^0-9])/ 
                @elements.splice i, 1
                for el in split
                    if el == ''
                        continue
                    prob = 0
                    if el.length > 1
                        if el.match /[^0-9]\d+/
                            prob = parseInt(el.substr 1) / @prob
                        else
                            probs = el.substring(2,el.length-1).split(',')
                            prob = (if p=='...' then p else parseInt(p) for p in probs)
                    basicChar =
                        field: 
                            str: el[0],
                            output: -> @str
                        prob: prob
                    if typeof basicChar.prob == 'number' and basicChar.prob > 0
                        totalProb += basicChar.prob
                    else
                        unassignedProb.push basicChar
                    @elements.splice i++, 0, basicChar
            
            # assign any missing probabilities
            leftoverprob = (1 - totalProb) / unassignedProb.length
            for i in [0..unassignedProb.length-1] by 1
                unassignedProb[i].prob = if @defMode == "split" then leftoverprob else 1
