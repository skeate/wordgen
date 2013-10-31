The **Mimic** class attempts to mimic the style of a given corpus. This can be
useful if you have some words already, but the structure is too complex to
be described simply using the other available rules. It works by analyzing what
follows what and storing that information in weighted trees.

    define ['cs!app/base'], (Base) ->
        class Mimic extends Base

Like the other rules, this should have a name and a list of elements. In this
case, the elements are words to imitate. It checks to ensure the correct
format (i.e., "[word word word]"), and then parses the list into an array of
individual words.

            constructor: (@name, elements) ->
                if not elements.match /^\[([^0-9]+ )*[^0-9]+\]$/
                    throw new Error "Invalid mimic list format."
                @elements = elements.substring(1,elements.length-1).split ' '

The parser prepares the trees. The weight is just how many times they are
repeated in the list. It also keeps tracking of what initial letters are used,
again weighting them by repetition in the list.

            parse: ->
                @initials = []
                @trees = {}
                for word in @elements
                    @initials.push word[0]
                    for i in [0..word.length-1]
                        if not @trees.hasOwnProperty word[i]
                            @trees[word[i]] = []
                        if i == word.length-1
                            @trees[word[i]].push null
                        else
                            @trees[word[i]].push word[i+1]

To output, randomly select an initial letter, then randomly follow the tree
until null is reached.

            output: ->
                rand = Math.floor Math.random() * @initials.length
                word = @initials[rand]
                loop
                    lastChar = word[word.length-1]
                    rand = Math.floor Math.random() * @trees[lastChar].length
                    next = @trees[lastChar][rand]
                    if next is null
                        break
                    word += next
                return word
