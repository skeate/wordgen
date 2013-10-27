define ['jquery','cs!app/rules'], ($, Rules)->
    (rules, output)->
        gen = new Rules(rules)
        $(output).html gen.output()
