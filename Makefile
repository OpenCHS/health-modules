tests:
	npm test

setup:
	npm install --save-dev babel-preset-es2015

deps:
	npm install

deploy-local:
	cp js/*.js ../openchs-server/external/
