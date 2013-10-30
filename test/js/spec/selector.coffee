define ['cs!app/selector','cs!app/base'], (Selector, Base) ->
    describe 'Selector', ->
        before ->
            @sel = new Selector 'Vowel', 'aeiou'
            @sel.parse [], {}
        describe 'object', ->
            it 'should be of type Base', ->
                @sel.should.be.an.instanceOf Base
            it 'should have a name', ->
                @sel.name.should.equal 'Vowel'
        describe 'selection', ->
            it 'should output a character', ->
                for i in [0..100]
                    temp = @sel.output()
                    temp.should.match /^[aeiou]$/, 'nonmatch: '+temp
            it 'should allow null selection', ->
                cOrNothing = new Selector 'corn', 'c50'
                cOrNothing.parse [], {}
                for i in [0..100]
                    cOrNothing.output().should.match /^c?$/
        describe 'named elements', ->
            before ->
                cons = new Selector 'Consonant', 'ptkbdg'
                v = new Selector 'V', 'v'
                @cvv = new Selector 'CorVorv', 'ConsonantVowelV'
                allNames =
                    'V': v
                    'Vowel': @sel
                    'Consonant': cons
                    'CorVorv': @cvv
                sortedNames = ['Consonant', 'Vowel', 'CorVorv', 'V']
                v.parse sortedNames, allNames
                cons.parse sortedNames, allNames
                @cvv.parse sortedNames, allNames
            it 'should have 3 elements', ->
                @cvv.elements.should.be.an.instanceOf Array
                @cvv.elements.length.should.equal 3
            it 'should output consonant, vowel, or v', ->
                for i in [0..100]
                    temp = @cvv.output()
                    temp.should.match /^[ptkbdg]|[aeiou]|v$/
