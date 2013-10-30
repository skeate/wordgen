require.config({
    baseUrl: 'js',
    paths: {
        app: '../../src/js/app',
        spec: 'spec',
        cs: 'lib/cs',
        'coffee-script': 'lib/coffee-script',
        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min'
    },
    urlArgs: 'bust=' + (new Date()).getTime()
});
 
require(['lib/chai'], function(chai){
    // chai
    var should = chai.should();

    // mocha
    mocha.ui('bdd');
    //mocha.reporter('html');

    require([
        'cs!spec/base',
        'cs!spec/selector',
        'cs!spec/merger',
        'cs!spec/rules'
    ], function(base,selector,merger) {
        if(window.mochaPhantomJS){mochaPhantomJS.run();}
        else{ mocha.run(); }
    });
});
