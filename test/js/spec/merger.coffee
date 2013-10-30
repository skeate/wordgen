define ['cs!app/merger','cs!app/selector','cs!app/base'], (Merger, Selector, Base) ->
    describe 'Merger', ->
        before ->
            @vowel = new Selector 'Vowel', 'aeiou'
            @cons  = new Selector 'Consonant', 'ptkbdg'
            @vowel.parse [], {}
            @cons.parse [], {}
            @cv = new Merger 'CV', 'ConsonantVowel'
            @cv.parse ['Consonant','Vowel'],
                'Consonant': @cons
                'Vowel': @vowel
            @liquid = new Selector 'Liquid', 'rlyw'
            @liquid.parse [],{}
            @clvv = new Merger 'CLV', 'ConsonantLiquidVowel{100,100}'
            @clvv.parse ['Consonant','Liquid','Vowel'],
                'Consonant': @cons
                'Liquid': @liquid
                'Vowel': @vowel
        describe 'object', ->
            it 'should be of type Base', ->
                @cv.should.be.an.instanceOf Base
            it 'should have a name', ->
                @cv.name.should.equal 'CV'
        describe 'merging', ->
            it 'should output 2 characters', ->
                temp = @cv.output()
                temp.length.should.equal 2
                temp.should.match /^[ptkbdg][aeiou]$/
            it 'should allow repetition', ->
                temp = @clvv.output()
                temp.length.should.equal 4
                temp.should.match /^[ptkbdg][rlyw][aeiou]{2}$/
            it 'should allow continuous repetition', ->
                rep = new Merger '','ba{100,50,...}'
                rep.parse [], {}
                for i in [0..100]
                    rep.output().should.match /^ba+$/
