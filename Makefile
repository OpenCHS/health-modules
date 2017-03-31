tests:
	npm test

setup:
	npm install --save-dev babel-preset-es2015

deps:
	npm install

deploy-local:
	npm run concat
	cp -r output/*.js ../openchs-server/external/
	cp -r deployables/*.json ../openchs-server/external/

setup-db:
	psql -h 0.0.0.0 -U openchs -a -f sql/data.sql