tests:
	npm test

setup:
	npm install --save-dev babel-preset-es2015

deps:
	npm install

deploy-local:
	rm -f output/*.js
	./node_modules/.bin/webpack deployables/programEncounterDecision.js output/programEncounterDecision.js
	./node_modules/.bin/webpack deployables/encounterDecision.js output/encounterDecision.js
	./node_modules/.bin/webpack deployables/individualRegistrationDecision.js output/individualRegistrationDecision.js
	./node_modules/.bin/webpack deployables/programEnrolmentDecision.js output/programEnrolmentDecision.js
	cp -r output/*.js ../openchs-server/external/
	cp -r deployables/*.json ../openchs-server/external/

setup-db:
	psql -h 0.0.0.0 -U openchs -a -f sql/data.sql