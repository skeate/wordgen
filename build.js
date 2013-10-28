({
    appDir: 'src/',
    baseUrl: 'js/',
    stubModules: ['cs'],

    dir: 'build',

    paths: {
        'cs': 'lib/cs',
        'coffee-script': 'lib/coffee-script',
        'jquery': 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min'
    },

    modules: [
        {
            name: 'app',
            exclude: ['coffee-script']
        }
    ]
})
