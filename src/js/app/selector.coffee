define ['cs!app/base'], (Base) ->
    class Selector extends Base
        output: ->
            prob = Math.random()
            i = -1
            while prob > 0 and @elements[++i]?
                prob -= @elements[i].prob
            if i == @elements.length then '' else @elements[i].field.output()
