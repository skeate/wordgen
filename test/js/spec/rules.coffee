define ['cs!app/rules','cs!app/selector'], (Rules,Selector) ->
    describe 'Rules', ->
        describe 'parsing', ->
            it 'should parse Selectors', ->
                temp = new Rules ['Vowel=aeiou']
                temp.selectors.length.should.equal 1
                temp.selectors[0].name.should.equal 'Vowel'
            it 'should parse Mergers', ->
                temp = new Rules ['CV:cv']
                temp.mergers.length.should.equal 1
                temp.mergers[0].name.should.equal 'CV'
            it 'should parse an output rule', ->
                temp = new Rules ['>output']
                temp.out.should.not.deep.equal {}
            it 'should have an error with invalid output format', ->
                temp = new Rules ['>a{']
                temp.error.should.equal 'Invalid output rule format.'
            it 'should parse substitutions', ->
                temp = new Rules ['sy~sh']
                temp.substitutions.should.not.deep.equal {}
                temp.substitutions.should.have.ownProperty 'sy'
                temp.substitutions.sy.should.equal 'sh'
            it 'should parse mimics', ->
                temp = new Rules ['eng<[qua zee bar]']
                temp.mimics.length.should.equal 1
                temp.mimics[0].name.should.equal 'eng'
                temp.mimics[0].elements.should.deep.equal ['qua','zee','bar']
        describe 'output', ->
            before ->
                rules = """
                        V=v
                        Q=q
                        VQ=o
                        >VVQQ
                        oq~ei
                        """
                @temp = new Rules rules.split '\n'
            it 'should sort names properly', ->
                @temp.out.elements.length.should.equal 3
                @temp.out.elements[0].field.name.should.equal 'V'
                @temp.out.elements[1].field.name.should.equal 'VQ'
                @temp.out.elements[2].field.name.should.equal 'Q'
            it 'should output correctly', ->
                @temp.output().should.match /^(vei ){100}$/
