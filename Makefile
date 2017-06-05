tests:
	npm test

setup:
	npm install --save-dev babel-preset-es2015

deps:
	npm install

package_rules:
	rm -f output/*.js
	./node_modules/.bin/webpack deployables/programEncounterDecision.js output/programEncounterDecision.js
	./node_modules/.bin/webpack deployables/encounterDecision.js output/encounterDecision.js
	./node_modules/.bin/webpack deployables/individualRegistrationDecision.js output/individualRegistrationDecision.js
	./node_modules/.bin/webpack deployables/programEnrolmentDecision.js output/programEnrolmentDecision.js
	./node_modules/.bin/webpack deployables/programConfig.js output/programConfig.js

deploy_local: package_rules
	cp -r output/*.js ../openchs-server/external/
	cp -r deployables/*.json ../openchs-server/external/
	date

recreate_db:
	flyway -user=openchs -password=password -url=jdbc:postgresql://localhost:5432/openchs -schemas=openchs clean
	flyway -user=openchs -password=password -url=jdbc:postgresql://localhost:5432/openchs -schemas=openchs -locations=filesystem:../openchs-server/src/main/resources/db/migration/ migrate

setup_impl_db:
	psql -h $(server) -U openchs -q -f lbp/villages.sql
	psql -h $(server) -U openchs -q -f lbp/catchments.sql

setup_db: recreate_db setup_health_modules setup_impl_db

setup_health_modules:
	curl -X POST http://$(server):8080/concepts -d @deployables/commonConcepts.json -H "Content-Type: application/json"

	curl -X POST http://$(server):8080/forms -d @lbp/registrationForm.json -H "Content-Type: application/json"

	curl -X POST http://$(server):8080/forms -d @deployables/outpatient/metadata/encounterForm.json -H "Content-Type: application/json"
	curl -X POST http://$(server):8080/concepts -d @deployables/outpatient/metadata/concepts.json -H "Content-Type: application/json"

	curl -X POST http://$(server):8080/concepts -d @deployables/mother/metadata/motherConcepts.json -H "Content-Type: application/json"
	curl -X POST http://$(server):8080/forms -d @deployables/mother/metadata/motherProgramEnrolmentForm.json -H "Content-Type: application/json"
	curl -X POST http://$(server):8080/forms -d @deployables/mother/metadata/motherANCForm.json -H "Content-Type: application/json"
	curl -X POST http://$(server):8080/forms -d @deployables/mother/metadata/motherDeliveryForm.json -H "Content-Type: application/json"
	curl -X POST http://$(server):8080/forms -d @deployables/mother/metadata/motherAbortionForm.json -H "Content-Type: application/json"
	curl -X POST http://$(server):8080/forms -d @deployables/mother/metadata/motherPNCForm.json -H "Content-Type: application/json"
	curl -X POST http://$(server):8080/forms -d @deployables/mother/metadata/motherProgramExitForm.json -H "Content-Type: application/json"

	curl -X POST http://$(server):8080/concepts -d @deployables/child/metadata/concepts.json -H "Content-Type: application/json"
	curl -X POST http://$(server):8080/forms -d @deployables/child/metadata/childProgramEnrolmentForm.json -H "Content-Type: application/json"
	curl -X POST http://$(server):8080/forms -d @deployables/child/metadata/childDefaultProgramEncounterForm.json -H "Content-Type: application/json"
	curl -X POST http://$(server):8080/forms -d @deployables/child/metadata/childProgramExitForm.json -H "Content-Type: application/json"

	curl -X POST http://$(server):8080/forms -d @deployables/ncd/metadata/screeningEncounterForm.json -H "Content-Type: application/json"

	curl -X POST http://$(server):8080/forms -d @deployables/diabetes/metadata/diabetesProgramEncounterForm.json -H "Content-Type: application/json"
	date

play:
	echo $(server)