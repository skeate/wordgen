define ['jquery','cs!app/rules'], ($, Rules)->
    $(document).ready ->
        $(document).keypress (event) ->
            if event.ctrlKey and
            ( event.keyCode is 10 or event.keyCode is 13 )
                rulesArray = $("#rules textarea").val().trim().split('\n')
                gen = new Rules rulesArray
                $('#output').html gen.output()
