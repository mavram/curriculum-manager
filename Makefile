dev:
	@NODE_ENV=development node app.js

dev-w:
	@NODE_ENV=development ./node_modules/.bin/supervisor --ignore public app.js

start:
	@NODE_ENV=production node app.js

test:
	@NODE_ENV=test ./node_modules/.bin/mocha
test-w:
	@NODE_ENV=test ./node_modules/.bin/mocha --watch

.PHONY: test test-w
