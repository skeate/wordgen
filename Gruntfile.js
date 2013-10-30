module.exports = function(grunt) {
    grunt.initConfig({
        shell: {
            'mocha-phantomjs': {
                command: 'mocha-phantomjs http://localhost:3000/test',
                options: {
                    stdout: true,
                    stderr: true
                }
           }
        },
        watch: {
            jsFiles: {
                files: ['**/*.coffee', '**/*.js'],
                tasks: ['shell:mocha-phantomjs']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell');
}
