define ['cs!app/mimic.litcoffee'], (Mimic) ->
    describe 'Mimic', ->
        it 'should have a name', ->
            mime = new Mimic 'test', '[word]'
            mime.should.have.ownProperty 'name'
            mime.name.should.equal 'test'
        it 'should replicate "abcde"', ->
            mime = new Mimic 'test', '[abcde]'
            mime.parse()
            mime.output().should.equal 'abcde'
        it 'should, given "abc" and "abd", output either one', ->
            mime = new Mimic 'test', '[abc abd]'
            mime.parse()
            for i in [0..100]
                mime.output().should.match /^ab[cd]$/
