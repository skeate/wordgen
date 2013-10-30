define ['cs!app/base'], (Base) ->
    describe 'Base', ->
        before ->
            @base = new Base 'Vowel','a50eiou'
            @base.parse [],{}
        it 'should have a name',->
            @base.should.have.property 'name'
            @base.name.should.equal 'Vowel'
        it 'should have a base probability of 100',->
            @base.prob.should.equal 100
        it 'should have a 50% probability for first element', ->
            @base.elements[0].prob.should.equal .5
        describe 'changed base probability',->
            before ->
                @base = new Base 'Vowel','10a4eiou'
                @base.parse [],{}
            it 'should have a base probability of 10',->
                @base.prob.should.equal 10
            it 'should have 5 elements, each with a field and prob',->
                @base.elements.should.be.an.instanceOf Array
                @base.elements.length.should.equal 5
                for element in @base.elements
                    element.should.have.ownProperty 'field'
                    element.should.have.ownProperty 'prob'
            it 'should have an element (a) with .4 prob, the rest .15', ->
                @base.elements[0].prob.should.equal .4
                for element in @base.elements
                    if element.field.output() == 'a'
                        element.prob.should.equal .4
                    else
                        element.prob.should.equal .15
        describe 'probability list',->
            before ->
                @base = new Base 'Vowel','a{100,50}e{100,50,...}io54u'
            it 'should parse', ->
                @base.parse [],{}
            it 'should have 5 elements', ->
                @base.elements.should.be.an.instanceOf Array
                @base.elements.length.should.equal 5
            it 'should have prob arrays for a and e', ->
                @base.elements[0].prob.should.have.ownProperty 'length'
                @base.elements[0].prob.should.deep.equal [100,50]
                @base.elements[1].prob.should.have.ownProperty 'length'
                @base.elements[1].prob.should.deep.equal [100,50,'...']
            it 'should have prob .54 for o', ->
                @base.elements[3].prob.should.equal .54
        describe 'named elements', ->
            before ->
                @vowel = new Base 'Vowel', 'aeiou'
                @v = new Base 'V', 'v'
                @cons = new Base 'Consonant', 'tpkdbg'
                @base = new Base 'CVvV', 'ConsonantVowelVVowel50'
                @allNames =
                    'V': @v
                    'Vowel': @vowel
                    'Consonant': @cons
                    'CVvV': @base
                @base.parse ['Consonant','Vowel','CVvV','V'], @allNames
            it 'should have 4 elements', ->
                @base.elements.should.be.an.instanceOf Array
                @base.elements.length.should.equal 4
            it 'should be Consonant Vowel V Vowel', ->
                @base.elements[0].field.name.should.equal 'Consonant'
                @base.elements[1].field.name.should.equal 'Vowel'
                @base.elements[2].field.name.should.equal 'V'
                @base.elements[3].field.name.should.equal 'Vowel'
            it 'should have a probability of 50% for last vowel', ->
                @base.elements[3].prob.should.equal .5
