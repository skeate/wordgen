define ['cs!app/base'], (Base) ->
    class Merger extends Base
        constructor: (name, elements) ->
            super name, elements
            @defMode = 'full'
        output: ->
            out = ''
            for element in @elements
                if typeof element.prob.length != "undefined"
                    for j in [0..element.prob.length-1]
                        p = element.prob[j]
                        prob = Math.random()
                        j-- if p is '...'
                        break if prob > ( p / @prob )
                        out += element.field.output()
                else
                    prob = Math.random()
                    out += element.field.output() if prob < element.prob
            return out
