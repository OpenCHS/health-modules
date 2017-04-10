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
	flyway -X -user=openchs -password=password -url=jdbc:postgresql://localhost:5432/openchs -schemas=openchs clean
	flyway -X -user=openchs -password=password -url=jdbc:postgresql://localhost:5432/openchs -schemas=openchs -locations=filesystem:../openchs-server/src/main/resources/db/migration/ migrate
	curl -vX POST http://192.168.73.1:8080/forms -d @lbp/registrationForm.json -H "Content-Type: application/json"
	curl -vX POST http://192.168.73.1:8080/forms -d @deployables/encounterForm.json -H "Content-Type: application/json"
	curl -vX POST http://192.168.73.1:8080/forms -d @deployables/mother/metadata/motherProgramEnrolmentForm.json -H "Content-Type: application/json"
	curl -vX POST http://192.168.73.1:8080/forms -d @deployables/mother/metadata/motherANCForm.json -H "Content-Type: application/json"
	curl -vX POST http://192.168.73.1:8080/forms -d @deployables/mother/metadata/motherAbortionForm.json -H "Content-Type: application/json"
	curl -vX POST http://192.168.73.1:8080/forms -d @deployables/mother/metadata/motherProgramExitForm.json -H "Content-Type: application/json"
	curl -vX POST http://192.168.73.1:8080/forms -d @deployables/child/metadata/childProgramEnrolmentForm.json -H "Content-Type: application/json"
	curl -vX POST http://192.168.73.1:8080/forms -d @deployables/child/metadata/childDefaultProgramEncounterForm.json -H "Content-Type: application/json"
	curl -vX POST http://192.168.73.1:8080/forms -d @deployables/child/metadata/childDefaultProgramExitForm.json -H "Content-Type: application/json"
	psql -h 0.0.0.0 -U openchs -a -f lbp/villages.sql