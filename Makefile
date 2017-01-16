tests:
	npm test

setup:
	npm install --save-dev babel-preset-es2015

deps:
	npm install

deploy-local:
	mkdir -p ../openchs-server/fs/config/modules/vhw
	cp modules/vhw/*.js* ../openchs-server/fs/config/modules/vhw/
	mkdir -p ../openchs-server/fs/config/modules/death
	cp modules/death/*.js* ../openchs-server/fs/config/modules/death/
