({
    appDir: 'src/',
    baseUrl: 'js/',
    stubModules: ['cs'],

    dir: 'build',

    paths: {
        'cs': 'lib/cs',
        'coffee-script': 'lib/coffee-script',
        'jquery': '//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min'
    },

    removeCombined: true,

    modules: [
        {
            name: 'app',
            exclude: ['coffee-script']
        }
    ]
})
