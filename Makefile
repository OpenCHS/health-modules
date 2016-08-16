setup:
	npm install --save-dev babel-preset-es2015

deps:
	npm install

test:
	npm test

deploy-local:
	mkdir -p ../openchs-server/fs/config/modules/vhw/js
	cp modules/vhw/js/* ../openchs-server/fs/config/modules/vhw/js