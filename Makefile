tests:
	npm test

setup:
	npm install --save-dev babel-preset-es2015

deps:
	npm install

deploy-local:
	cp modules/vhw/*.js ../openchs-server/external/modules/vhw/
