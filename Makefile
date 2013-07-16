dev:
	@NODE_ENV=dev node app.js

dev-w:
	@NODE_ENV=dev ./node_modules/.bin/supervisor app.js

start:
	@NODE_ENV=prd node.js app.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha
test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha --watch

.PHONY: test test-w
