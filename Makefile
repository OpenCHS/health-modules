tests:
	npm test

setup:
	npm install --save-dev babel-preset-es2015

deps:
	npm install

package_rules:
	rm -f output/*.js
	./node_modules/.bin/webpack --config build/programEncounterDecisionWebpack.config.js
	./node_modules/.bin/webpack --config build/encounterDecisionWebpack.config.js
	./node_modules/.bin/webpack --config build/individualRegistrationDecisionWebpack.config.js
	./node_modules/.bin/webpack --config build/programEnrolmentDecisionWebpack.config.js
	./node_modules/.bin/webpack --config build/programConfigWebpack.config.js

deploy_rules_locally: package_rules
	cp -r output/*.js ../openchs-server/external/
	cp -r health_modules/*.json ../openchs-server/external/
	date

recreate_db:
	flyway -user=openchs -password=password -url=jdbc:postgresql://localhost:5432/openchs -schemas=openchs clean
	flyway -user=openchs -password=password -url=jdbc:postgresql://localhost:5432/openchs -schemas=openchs -locations=filesystem:../openchs-server/src/main/resources/db/migration/ migrate

setup_impl_db:
	curl -X POST http://$(server):$(port)/catchments -d @./lbp/catchments.json -H "Content-Type: application/json"

setup_db: recreate_db setup_health_modules setup_impl_db

setup_health_modules:
	curl -X POST http://$(server):$(port)/concepts -d @health_modules/commonConcepts.json -H "Content-Type: application/json"

	curl -X POST http://$(server):$(port)/forms -d @lbp/registrationForm.json -H "Content-Type: application/json"

	curl -X POST http://$(server):$(port)/forms -d @health_modules/outpatient/metadata/encounterForm.json -H "Content-Type: application/json"
	curl -X POST http://$(server):$(port)/concepts -d @health_modules/outpatient/metadata/concepts.json -H "Content-Type: application/json"

	curl -X POST http://$(server):$(port)/concepts -d @health_modules/mother/metadata/motherConcepts.json -H "Content-Type: application/json"
	curl -X POST http://$(server):$(port)/programs -d @health_modules/mother/metadata/motherProgram.json -H "Content-Type: application/json"
	curl -X POST http://$(server):$(port)/forms -d @health_modules/mother/metadata/motherProgramEnrolmentForm.json -H "Content-Type: application/json"
	curl -X POST http://$(server):$(port)/forms -d @health_modules/mother/metadata/motherANCForm.json -H "Content-Type: application/json"
	curl -X POST http://$(server):$(port)/forms -d @health_modules/mother/metadata/motherDeliveryForm.json -H "Content-Type: application/json"
	curl -X POST http://$(server):$(port)/forms -d @health_modules/mother/metadata/motherAbortionForm.json -H "Content-Type: application/json"
	curl -X POST http://$(server):$(port)/forms -d @health_modules/mother/metadata/motherPNCForm.json -H "Content-Type: application/json"
	curl -X POST http://$(server):$(port)/forms -d @health_modules/mother/metadata/motherProgramExitForm.json -H "Content-Type: application/json"

	curl -X POST http://$(server):$(port)/concepts -d @health_modules/child/metadata/concepts.json -H "Content-Type: application/json"
	curl -X POST http://$(server):$(port)/programs -d @health_modules/child/metadata/childProgram.json -H "Content-Type: application/json"
	curl -X POST http://$(server):$(port)/forms -d @health_modules/child/metadata/childProgramEnrolmentForm.json -H "Content-Type: application/json"
	curl -X POST http://$(server):$(port)/forms -d @health_modules/child/metadata/childDefaultProgramEncounterForm.json -H "Content-Type: application/json"
	curl -X POST http://$(server):$(port)/forms -d @health_modules/child/metadata/childProgramExitForm.json -H "Content-Type: application/json"

	curl -X POST http://$(server):$(port)/forms -d @health_modules/ncd/metadata/screeningEncounterForm.json -H "Content-Type: application/json"

	curl -X POST http://$(server):$(port)/programs -d @health_modules/diabetes/metadata/diabetesProgram.json -H "Content-Type: application/json"
	curl -X POST http://$(server):$(port)/forms -d @health_modules/diabetes/metadata/diabetesProgramEncounterForm.json -H "Content-Type: application/json"
	date

package_health_modules : package_rules
	rm -f output/openchs_health_modules.tar.gz
	rm -rf output/health_modules
	mkdir output/health_modules
	cp -r health_modules/commonConcepts.json health_modules/child health_modules/mother health_modules/diabetes health_modules/ncd health_modules/outpatient health_modules/deploy.sh output/health_modules/
	mkdir output/health_modules/rules
	cp output/*.js output/health_modules/rules/
	cp health_modules/customMessages.json output/health_modules
	cd output/health_modules && tar zcvf ../openchs_health_modules.tar.gz commonConcepts.json child mother diabetes ncd outpatient rules customMessages.json deploy.sh

package_impl :
	rm -rf output/impl
	mkdir output/impl
	cp lbp/registrationForm.json lbp/villages.sql lbp/catchments.sql lbp/deploy.sh output/impl
	cd output/impl && tar zcvf ../openchs_impl.tar.gz *.*
	
play:
	echo $(server)