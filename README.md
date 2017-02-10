# wordgen

[![Greenkeeper badge](https://badges.greenkeeper.io/skeate/wordgen.svg)](https://greenkeeper.io/)

Should perhaps come up with a better name, but it is what it is for now. wordgen
is a word generator, useful (primarily?) for
[conlangers.](http://en.wikipedia.org/wiki/Constructed_language)

It can be seen in action [here](http://wordgen.tk/).

## Build
To build wordgen (as it's mostly Coffeescript), run `make`. Afterward you should
have a "build" directory that will have the transpiled/minified code, ready for
hosting.

On Windows, if requirejs is installed globally, `r.js.cmd -o build.js` will
build. The makefile also cleans up the directory a bit, removing the coffee
source files and the CS compiler.

## Tests
`make test` to run tests once, `make test-w` or `npm test` to run tests any time
a file is modified.

The tests can also be run in the browser: run a web server at the project root,
and go to test/index.html. This will also show you the coverage, using
[blanket.js](http://blanketjs.org/).
