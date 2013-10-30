all:
	node node_modules/requirejs/bin/r.js -o build.js
	rm build/js/lib/coffee-script.js
	rm -r build/js/app

test:
	grunt shell:mocha-phantomjs

test-w:
	grunt watch

.PHONY: test test-w
