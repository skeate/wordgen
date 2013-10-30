require.config({
    baseUrl: 'js',
    paths: {
        cs: 'lib/cs',
        'coffee-script': 'lib/coffee-script',
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min'
    },
    urlArgs: "bust="+(new Date()).getTime()
});

require(['cs!app/generator']);
